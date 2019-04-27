import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';
import { ObjectiveService } from '../../@core/services/objective.service';
import { Observable, forkJoin } from 'rxjs';
import { ObjectiveCollection } from '../../@core/collections/objective.collection';
import { WorldService } from '../../@core/services/world.service';
import { takeWhile, tap } from 'rxjs/operators';
import { WorldCollection } from '../../@core/collections/world.collection';
import { IWorld } from '../../@core/models/world.model';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';

const MIN_ZOOM = 0;
const MAX_ZOOM = 6;

@Component({
  selector: 'ngx-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  loading = true;
  options = {
    crs: L.CRS.Simple,
    zoom: 3,
    center: [-194, 165],
    maxBoundsViscosity: 1.0,
    maxBounds: L.latLngBounds(
      { lat: -255.625, lng: 0.025390625 },
      { lat: -32.625, lng: 255.9091796875 },
    ),
  };
  layers = [];
  naWorlds: Array<IWorld> = [];
  euWorlds: Array<IWorld> = [];
  selectedWorld: string;

  constructor(
    private worldService: WorldService,
    private objectiveService: ObjectiveService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(params => {
        this.selectedWorld = params.get('world');
      });

    this.worldService.worlds
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe((worlds: WorldCollection) => {
        this.naWorlds = worlds.region(GW2Region.NA).sortBy('name', 'asc').all();
        this.euWorlds = worlds.region(GW2Region.EU).sortBy('name', 'asc').all();
      });
  }

  handleClick(event) {
    // console.log(event);
  }

  changeWorld(event) {
    this.router.navigate(['map', event.target.value]);
  }

  onMapReady(map: L.Map) {
    // console.log(map);
    map.on('click', this.handleClick.bind(this));

    this.layers = [
      L.tileLayer(
        'https://{s}.guildwars2.com/2/1/{z}/{x}/{y}.jpg',
        {
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
          subdomains: ['tiles', 'tiles1', 'tiles2', 'tiles3', 'tiles4'],
          continuousWorld: true,
        },
      ),
    ];

    forkJoin(
      this.prepareIcons(),
      this.objectiveService.objectives,
    )
      .pipe(
        takeWhile(() => this.alive),
        tap(([icons, objectives]) => this.setupInitialMarkers(icons, objectives, map)),
      ).subscribe(() => this.loading = false);
  }

  prepareIcons() {
    const types = ['camp', 'tower', 'keep', 'castle'];
    const colors = ['green', 'blue', 'red', 'neutral'];

    return new Observable((observer) => {
      const mapIcons = {
        camp: { green: null, blue: null, red: null, neutral: null },
        tower: { green: null, blue: null, red: null, neutral: null },
        keep: { green: null, blue: null, red: null, neutral: null },
        castle: { green: null, blue: null, red: null, neutral: null },
        claimed: {
          camp: { green: null, blue: null, red: null, neutral: null },
          tower: { green: null, blue: null, red: null, neutral: null },
          keep: { green: null, blue: null, red: null, neutral: null },
          castle: { green: null, blue: null, red: null, neutral: null },
        },
      };

      types.forEach(type => {
        colors.forEach(color => {
          mapIcons[type][color] = L.icon({
            iconUrl: `assets/map-icons/${type}_${color}.png`,
            iconSize: [26, 26],
          });
        });
      });

      observer.next(mapIcons);
      observer.complete();
    });
  }

  setupInitialMarkers(icons: any, objectives: ObjectiveCollection, map: L.Map) {
    objectives.filterTypes('Camp', 'Tower', 'Keep', 'Castle').all()
      .forEach(objective => {
        if (!objective.coord) {
          return;
        }

        const coord = map.unproject([objective.coord[0], objective.coord[1]], MAX_ZOOM);
        this.layers.push(new L.Marker(coord, {
          icon: icons[objective.type.toLowerCase()].neutral,
          title: objective.name,
          riseOnHover: true,
        }));
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
