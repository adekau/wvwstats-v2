import { Match, IMatch } from '../models/match.model';
import { GW2Region } from '../enums/gw2region.enum';
import { WorldCollection } from './world.collection';

export class MatchCollection {
  matches: Match[] = [];
  worlds: WorldCollection;

  constructor(
    response: IMatch[] = [],
    worlds: WorldCollection = new WorldCollection(),
  ) {
    this.worlds = worlds;
    this.matches = response.map(
      (match: IMatch) => new Match(match, this.worlds),
    );
  }

  find(region: GW2Region, tier: number): Match {
    const matchId = `${region.valueOf()}-${tier}`;
    return this.matches.filter(match => matchId === match.id)[0];
  }

  region(region: GW2Region): MatchCollection {
    const matchId = `${region.valueOf()}-`;
    return new MatchCollection(
      this.matches.filter(match => match.id.startsWith(matchId)),
      this.worlds,
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
