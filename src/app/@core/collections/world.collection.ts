import { IWorld, World } from '../models/world.model';
import { GW2Region } from '../enums/gw2region.enum';

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

  region(region: GW2Region): WorldCollection {
    return new WorldCollection(
      this.worlds.filter(world => world.id.toString().startsWith(region.toString(10))),
    );
  }

  sortBy(col: 'id' | 'name', order: 'asc' | 'desc'): WorldCollection {
    return new WorldCollection(
      this.worlds.sort((a: World, b: World) => {
        if (col === 'id') {
          if (order === 'desc') {
            return b.id - a.id;
          } else if (order === 'asc') {
            return a.id - b.id;
          } else {
            throw Error('Unknown sort order.');
          }
        } else if (col === 'name') {
          if (order === 'desc') {
            return b.name > a.name ? 1 : b.name === a.name ? 0 : -1;
          } else if (order === 'asc') {
            return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
          } else {
            throw Error('Unknown sort order.');
          }
        } else {
          throw Error('Unknown column to sort by.');
        }
      }),
    );
  }

  subset(...ids: number[]): WorldCollection {
    return new WorldCollection(ids.map(id => this.find(id)));
  }
}
