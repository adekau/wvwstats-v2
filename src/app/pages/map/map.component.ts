import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';
import { ObjectiveService } from '../../@core/services/objective.service';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { ObjectiveCollection } from '../../@core/collections/objective.collection';
import { WorldService } from '../../@core/services/world.service';
import { takeWhile, tap, shareReplay } from 'rxjs/operators';
import { WorldCollection } from '../../@core/collections/world.collection';
import { IWorld } from '../../@core/models/world.model';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from '../../@core/services/match.service';
import { Match } from '../../@core/models/match.model';
import { DEFAULT_BUFFER_SIZE } from '../../@core/services/buffer.token';

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
  icons$: Observable<any>;
  layers = [];
  tileLayers = [];
  objectiveMarkers = {};
  naWorlds: Array<IWorld> = [];
  euWorlds: Array<IWorld> = [];
  selectedWorld: string;
  match: Match;

  constructor(
    @Inject(DEFAULT_BUFFER_SIZE) private buffer: number,
    private matchService: MatchService,
    private worldService: WorldService,
    private objectiveService: ObjectiveService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    combineLatest(
      this.route.paramMap,
      this.matchService.matches,
    )
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(([params, mc]) => {
        this.selectedWorld = params.get('world');
        if (this.selectedWorld) {
          this.loading = true;
          this.match = mc.findWorld(this.selectedWorld);
          const maps = {};
          this.match.maps.forEach(map => {
            const indexedObjectives = {};
            map.objectives.forEach(objective => {
              indexedObjectives[objective.id] = objective;
            });
            maps[map.id] = indexedObjectives;
          });
          this.updateMarkers(maps);
          this.loading = false;
        }
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

  get icons() {
    if (!this.icons$) {
      this.icons$ = this.prepareIcons()
        .pipe(
          shareReplay(this.buffer),
        );
    }

    return this.icons$;
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

    this.tileLayers = [
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
      this.icons,
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
        this.objectiveMarkers[objective.id] = new L.Marker(coord, {
          icon: icons[objective.type.toLowerCase()].neutral,
          title: objective.name,
          riseOnHover: true,
        });
      });

    this.setLayers();
  }

  updateMarkers(mapInfo) {
    this.icons.subscribe(icons => {
      Object.keys(this.objectiveMarkers).forEach(key => {
        const objective: L.Marker = this.objectiveMarkers[key];
        const mapId = parseInt(key.split('-')[0], 10);
        if (mapInfo[mapId] && mapInfo[mapId][key]) {
          const color = mapInfo[mapId][key].owner.toLowerCase();
          const type = mapInfo[mapId][key].type.toLowerCase();
          objective.setIcon(icons[type][color]);
        }
      });
    });
  }

  setLayers() {
    this.layers = [
      ...this.tileLayers,
      ...Object.values(this.objectiveMarkers),
    ];
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
