import { IGlicko } from '../models/glicko.model';
import { WorldCollection } from './world.collection';
import { GW2Region } from '../enums/gw2region.enum';

export class GlickoCollection {
  glicko: IGlicko[];

  constructor(res: IGlicko[]) {
    this.glicko = res;
  }

  find(serverId: number): IGlicko {
    return this.glicko.find(world => world.id === serverId);
  }

  glickoRanks(region: GW2Region, worlds: WorldCollection) {
    const glickoRanks = [];
    const currentGlickoRanks = this.region(region).all().sort((a: IGlicko, b: IGlicko) => {
      const aCurrent = a.glicko.rating - a.glicko.delta;
      const bCurrent = b.glicko.rating - b.glicko.delta;
      return bCurrent - aCurrent;
    });

    const predicatedGlickoRanks = this.region(region).all().sort((a: IGlicko, b: IGlicko) => {
      const aPredicted = a.glicko.rating;
      const bPredicted = b.glicko.rating;
      return bPredicted - aPredicted;
    });

    predicatedGlickoRanks.forEach((predicted, i) => {
      const predictedRank = i + 1;
      const predictedServer = worlds.find(predicted.id).name;
      currentGlickoRanks.forEach((cur, j) => {
        if (cur.id === predicted.id) {
          const curRank = j + 1;
          const change = curRank - predictedRank;
          const changeSymbol = change > 0 ? '⬆' : change < 0 ? '⬇' : '―';
          const changeDisplay = change === 0 ? '' : Math.abs(change);
          const changeClass = change > 0 ? 'pos' : change < 0 ? 'neg' : 'no-change';
          glickoRanks.push({
            rank: predictedRank,
            rankChange: `
            <span class="${changeClass}">
              ${changeSymbol}${changeDisplay}
            </span>
            `,
            server: predictedServer,
            old_rating: parseFloat((cur.glicko.rating - cur.glicko.delta).toFixed(3)),
            new_rating: parseFloat(cur.glicko.rating.toFixed(3)),
            change: parseFloat(cur.glicko.delta.toFixed(3)),
          });
        }
      });
    });

    return glickoRanks;
  }

  region(region: GW2Region) {
    return new GlickoCollection(
      this.glicko.filter(world => world.id.toString().startsWith(region.toString(10))),
    );
  }

  all() {
    return [...this.glicko];
  }
}
