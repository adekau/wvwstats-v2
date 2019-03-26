import { Observable } from "rxjs";
import { IMatchWorlds, IMatchAllWorlds, MatchWorlds, MatchAllWorlds } from "./matchworlds.model";
import { MatchKills } from "./matchkills.model";
import { MatchDeaths } from "./matchdeaths.model";
import { MatchVictoryPoints } from "./matchvictorypoints.model";
import { Skirmish } from "./skirmish.model";
import { Map } from "./maps.model";
import { MatchCollection } from "../collections/match.collection";
import { IServerMatchInfo } from "./servermatchinfo.model";
import { MatchScores } from "./matchscores.model";
import { WorldCollection } from "../collections/world.collection";

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
  maps: Map[];
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
  private matchworlds: WorldCollection;

  constructor(match: IMatch, matchworlds: WorldCollection) {
    this.id = match.id;
    this.start_time = match.start_time;
    this.end_time = match.end_time;
    this.worlds = match.worlds;
    this.scores = match.scores;

    this.kills = match.kills;
    this.deaths = match.deaths;
    this.maps = match.maps;
    this.victory_points = match.victory_points;
    this.skirmishes = match.skirmishes;
    this.matchworlds = matchworlds;
  }

  get matchWorlds() {
    return new MatchWorlds(this.worlds, this.matchworlds);
  }

  get allWorlds() {
    return new MatchAllWorlds(this.all_worlds, this.matchworlds);
  }

  get start() {
    return new Date(this.start_time);
  }

  get end() {
    return new Date(this.end_time);
  }

  getServerMatchInfo(color: string): IServerMatchInfo {
    return {
      kills: this.kills[color],
      deaths: this.deaths[color],
      all_worlds: this.allWorlds[color],
      score: this.scores[color],
      world: this.matchWorlds[color],
      victory_points: this.victory_points[color],
      skirmish_score: this.skirmishes[this.skirmishes.length - 1].scores[color]
    };
  }
}
