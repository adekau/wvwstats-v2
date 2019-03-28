import { IObjective, Objective } from '../models/objective.model';

export class ObjectiveCollection {
  objectives: Array<Objective>;

  constructor(response: IObjective[] = []) {
    this.objectives = response.map(obj => new Objective(obj));
  }

  find(id: string): Objective {
    return this.objectives.find(objective => objective.id === id);
  }

  all(): Array<Objective> {
    return this.objectives;
  }

  filterTypes(...types: string[]): ObjectiveCollection {
    return new ObjectiveCollection(
      this.objectives
        .filter(objective => objective.type)
        .filter(objective => types.includes(objective.type)),
    );
  }
}
