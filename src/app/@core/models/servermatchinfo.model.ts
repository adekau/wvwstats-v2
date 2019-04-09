import { IWorldObjectiveCount } from './objective.model';
import { WorldCollection } from '../collections/world.collection';
import { IWorld } from './world.model';

export interface IServerMatchInfo {
  world: IWorld;
  all_worlds: WorldCollection;
  kills: number;
  deaths: number;
  victory_points: number;
  score: number;
  skirmish_score: number;
  scorePercent: number;
  ppt: number;
  objectiveCount: IWorldObjectiveCount;
  kd: number;
}
