import { MatchScores } from './matchscores.model';
import { MapBonus } from './mapbonus.model';
import { IObjective, IObjectiveCount } from './objective.model';
import { MatchDeaths } from './matchdeaths.model';
import { MatchKills } from './matchkills.model';
import { IMatchPPT } from './matchppt.model';
import { ObjectiveCollection } from '../collections/objective.collection';
import { GW2MapType } from '../enums/gw2maptype.enum';

export interface IMapScores {
  type: string;
  scores: MatchScores;
}

export interface IMap {
  id: number;
  type: GW2MapType;
  scores: MatchScores;
  objectives: IObjective[];
  deaths: MatchDeaths;
  kills: MatchKills;
  bonuses?: MapBonus[];
}

export class Map implements IMap {
  id: number;
  type: GW2MapType;
  scores: MatchScores;
  objectives: IObjective[];
  deaths: MatchDeaths;
  kills: MatchKills;
  bonuses?: MapBonus[];
  gw2objectives: ObjectiveCollection;

  constructor(map: IMap, gw2objectives: ObjectiveCollection) {
    this.id = map.id;
    this.type = map.type;
    this.scores = map.scores;
    this.objectives = map.objectives;
    this.deaths = map.deaths;
    this.kills = map.kills;
    this.gw2objectives = gw2objectives.filterTypes('Tower', 'Camp', 'Keep', 'Castle');

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
      camp: { red: 0, blue: 0, green: 0 },
      tower: { red: 0, blue: 0, green: 0 },
      keep: { red: 0, blue: 0, green: 0 },
      castle: { red: 0, blue: 0, green: 0 },
    };

    this.objectives.forEach(objective => {
      if (!objective.owner || !objective.points_tick) {
        return;
      }
      const o = this.gw2objectives.find(objective.id);
      if (!o.type) {
        return;
      }

      oc[o.type.toLowerCase()][objective.owner.toLowerCase()]++;
    });

    return oc;
  }
}
