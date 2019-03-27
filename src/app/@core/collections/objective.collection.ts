import { IObjective, Objective } from '../models/objective.model';

export class ObjectiveCollection {
  objectives: Array<IObjective>;

  constructor(response: IObjective[] = []) {
    this.objectives = response.map(obj => new Objective(obj));
  }
}
