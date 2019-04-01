import { IWorldObjectiveCount } from './objective.model';
import { WorldCollection } from '../collections/world.collection';

export interface IServerMatchInfo {
  world: number;
  all_worlds: WorldCollection;
  kills: number;
  deaths: number;
  victory_points: number;
  score: number;
  skirmish_score: number;
  scorePercent: number;
  ppt: number;
  objectiveCount: IWorldObjectiveCount;
}
