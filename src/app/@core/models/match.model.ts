import { Observable } from 'rxjs';
import { IMatchWorlds, IMatchAllWorlds, MatchWorlds, MatchAllWorlds } from './matchworlds.model';
import { MatchKills } from './matchkills.model';
import { MatchDeaths } from './matchdeaths.model';
import { MatchVictoryPoints } from './matchvictorypoints.model';
import { Skirmish } from './skirmish.model';
import { IMap, Map } from './maps.model';
import { MatchCollection } from '../collections/match.collection';
import { IServerMatchInfo } from './servermatchinfo.model';
import { MatchScores, IMatchScoresPercentage } from './matchscores.model';
import { WorldCollection } from '../collections/world.collection';
import { IMatchPPT } from './matchppt.model';
import { IObjectiveCount } from './objective.model';
import { ObjectiveCollection } from '../collections/objective.collection';

export interface IMatch {
  id: string;
  start_time: string;
  end_time: string;
  worlds: IMatchWorlds;
  scores: MatchScores;
  all_worlds: IMatchAllWorlds;
  kills: MatchKills;
  deaths: MatchDeaths;
  victory_points: MatchVictoryPoints;
  skirmishes: Skirmish[];
  maps: IMap[];
}

export abstract class MatchData {
  abstract get matches(): Observable<MatchCollection>;
  abstract requestMatches(): Observable<MatchCollection>;
}

export class Match implements IMatch {
  id: string;
  start_time: string;
  end_time: string;
  worlds: IMatchWorlds;
  scores: MatchScores;
  all_worlds: IMatchAllWorlds;
  kills: MatchKills;
  deaths: MatchDeaths;
  victory_points: MatchVictoryPoints;
  skirmishes: Skirmish[];
  maps: Map[];
  private gw2worlds: WorldCollection;
  private gw2objectives: ObjectiveCollection;

  constructor(
    match: IMatch,
    gw2worlds: WorldCollection,
    gw2objectives: ObjectiveCollection,
  ) {
    this.id = match.id;
    this.start_time = match.start_time;
    this.end_time = match.end_time;
    this.worlds = match.worlds;
    this.scores = match.scores;
    this.all_worlds = match.all_worlds;
    this.kills = match.kills;
    this.deaths = match.deaths;
    this.maps = match.maps.map((map: IMap) => new Map(map, gw2objectives));
    this.victory_points = match.victory_points;
    this.skirmishes = match.skirmishes;
    this.gw2worlds = gw2worlds;
    this.gw2objectives = gw2objectives;
  }

  get matchWorlds() {
    return new MatchWorlds(this.worlds, this.gw2worlds);
  }

  get allWorlds() {
    return new MatchAllWorlds(this.all_worlds, this.gw2worlds);
  }

  get scorePercentages(): IMatchScoresPercentage {
    const max = Math.max(
      this.lastSkirmish.scores.red,
      this.lastSkirmish.scores.blue,
      this.lastSkirmish.scores.green,
    );
    return {
      red: (this.lastSkirmish.scores.red / max) * 100,
      blue: (this.lastSkirmish.scores.blue / max) * 100,
      green: (this.lastSkirmish.scores.green / max) * 100,
    };
  }

  get start() {
    return new Date(this.start_time);
  }

  get end() {
    return new Date(this.end_time);
  }

  get lastSkirmish(): Skirmish {
    return this.skirmishes[this.skirmishes.length - 1];
  }

  get ppt(): IMatchPPT {
    const ppt: IMatchPPT = { red: 0, blue: 0, green: 0 };

    (<Map[]>this.maps).forEach((map: Map) => {
      ppt.red += map.ppt.red;
      ppt.blue += map.ppt.blue;
      ppt.green += map.ppt.green;
    });

    return ppt;
  }

  get objectiveCount(): IObjectiveCount {
    const oc: IObjectiveCount = {
      camp: { red: 0, blue: 0, green: 0 },
      tower: { red: 0, blue: 0, green: 0 },
      keep: { red: 0, blue: 0, green: 0 },
      castle: { red: 0, blue: 0, green: 0 },
    };

    (<Map[]>this.maps).forEach((map: Map) => {
      oc.camp.red += map.objectiveCount.camp.red;
      oc.camp.blue += map.objectiveCount.camp.blue;
      oc.camp.green += map.objectiveCount.camp.green;

      oc.tower.red += map.objectiveCount.tower.red;
      oc.tower.blue += map.objectiveCount.tower.blue;
      oc.tower.green += map.objectiveCount.tower.green;

      oc.keep.red += map.objectiveCount.keep.red;
      oc.keep.blue += map.objectiveCount.keep.blue;
      oc.keep.green += map.objectiveCount.keep.green;

      oc.castle.red += map.objectiveCount.castle.red;
      oc.castle.blue += map.objectiveCount.castle.blue;
      oc.castle.green += map.objectiveCount.castle.green;
    });

    return oc;
  }

  getServerMatchInfo(color: string): IServerMatchInfo {
    return {
      kills: this.kills[color],
      deaths: this.deaths[color],
      all_worlds: this.allWorlds[color],
      score: this.scores[color],
      world: this.matchWorlds[color],
      victory_points: this.victory_points[color],
      skirmish_score: this.lastSkirmish.scores[color],
      scorePercent: this.scorePercentages[color],
      ppt: this.ppt[color],
      objectiveCount: {
        camp: this.objectiveCount.camp[color],
        tower: this.objectiveCount.tower[color],
        keep: this.objectiveCount.keep[color],
        castle: this.objectiveCount.castle[color],
      },
    };
  }
}
