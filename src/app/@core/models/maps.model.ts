import { MatchScores } from './matchscores.model';
import { MapBonus } from './mapbonus.model';
import { IObjective, IObjectiveCount } from './objective.model';
import { MatchDeaths } from './matchdeaths.model';
import { MatchKills } from './matchkills.model';
import { IMatchPPT } from './matchppt.model';

export interface IMapScores {
  type: string;
  scores: MatchScores;
}

export interface IMap {
  id: number;
  type: string;
  scores: MatchScores;
  objectives: IObjective[];
  deaths: MatchDeaths;
  kills: MatchKills;
  bonuses?: MapBonus[];
}

export class Map implements IMap {
  id: number;
  type: string;
  scores: MatchScores;
  objectives: IObjective[];
  deaths: MatchDeaths;
  kills: MatchKills;
  bonuses?: MapBonus[];

  constructor(map: IMap) {
    this.id = map.id;
    this.type = map.type;
    this.scores = map.scores;
    this.objectives = map.objectives;
    this.deaths = map.deaths;
    this.kills = map.kills;

    if (map.bonuses) {
      this.bonuses = map.bonuses;
    }
  }

  get ppt() {
    const ppt: IMatchPPT = { red: 0, blue: 0, green: 0 };
    this.objectives.forEach(objective => {
      if (!objective.owner || !objective.points_tick) {
        return;
      }

      ppt[objective.owner.toLowerCase()] += objective.points_tick;
    });
    return ppt;
  }

  get objectiveCount(): IObjectiveCount {
    const oc: IObjectiveCount = {
      camps: { red: 0, blue: 0, green: 0 },
      towers: { red: 0, blue: 0, green: 0 },
      keeps: { red: 0, blue: 0, green: 0 },
      castles: { red: 0, blue: 0, green: 0 },
    };

    this.objectives.forEach(objective => {
      if (!objective.owner || !objective.points_tick) {
        return;
      }

      // oc[objective.]
    });

    return oc;
  }
}
