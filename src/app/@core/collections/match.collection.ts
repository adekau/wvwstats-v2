import { Match, IMatch } from '../models/match.model';
import { GW2Region } from '../enums/gw2region.enum';
import { WorldCollection } from './world.collection';
import { ObjectiveCollection } from './objective.collection';

export class MatchCollection {
  matches: Match[] = [];
  worlds: WorldCollection;
  objectives: ObjectiveCollection;

  constructor(
    response: IMatch[] = [],
    worlds: WorldCollection = new WorldCollection(),
    objectives: ObjectiveCollection = new ObjectiveCollection(),
  ) {
    this.worlds = worlds;
    this.objectives = objectives;
    this.matches = response.map(
      (match: IMatch) => new Match(match, this.worlds, this.objectives),
    );
  }

  find(region: GW2Region, tier: number): Match {
    const matchId = `${region.valueOf()}-${tier}`;
    return this.matches.find(match => matchId === match.id);
  }

  findWorld(world: number)
  findWorld(world: string)
  findWorld(world: number | string) {
    return this.matches.find(match => {
      let involvedWorlds: Array<number | string>;
      if (typeof world === 'number') {
        involvedWorlds = [
          ...match.all_worlds.red,
          ...match.all_worlds.blue,
          ...match.all_worlds.green,
        ];
      } else if (typeof world === 'string') {
        involvedWorlds = [
          ...match.allWorlds.red.worlds.map(w => w.name),
          ...match.allWorlds.blue.worlds.map(w => w.name),
          ...match.allWorlds.green.worlds.map(w => w.name),
        ];
      } else {
        throw Error('Wrong world data type for findWorld.');
      }

      return involvedWorlds.includes(world);
    });
  }

  region(region: GW2Region): MatchCollection {
    const matchId = `${region.valueOf()}-`;
    return new MatchCollection(
      this.matches.filter(match => match.id.startsWith(matchId)),
      this.worlds,
      this.objectives,
    );
  }

  get empty() {
    return !this.matches.length;
  }

  get length() {
    return this.matches.length;
  }

  all() {
    return this.matches;
  }
}
