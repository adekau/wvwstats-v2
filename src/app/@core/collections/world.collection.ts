import { IWorld, World } from "../models/world.model";

export class WorldCollection {
  worlds: Array<World> = [];

  constructor(response: Array<IWorld> = []) {
    this.worlds = response.map(world => new World(world));
  }

  find(id: number): World {
    return this.worlds.find(world => world.id === id);
  }

  get length() {
    return this.worlds.length;
  }

  get empty() {
    return !this.worlds.length;
  }

  all() {
    return this.worlds;
  }

  subset(...ids: number[]): WorldCollection {
    return new WorldCollection(ids.map(id => this.find(id)));
  }
}
