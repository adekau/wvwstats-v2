import { IGlicko } from '../models/glicko.model';

export class GlickoCollection {
  glicko: IGlicko[];

  constructor(res: IGlicko[]) {
    this.glicko = res;
  }

  find(serverId: number): IGlicko {
    return this.glicko.find(world => world.id === serverId);
  }

  all() {
    return [...this.glicko];
  }
}
