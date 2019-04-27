import { MatchArchiveCollection } from './matcharchive.collection';
import { IMatchArchive } from '../../models/matcharchive.model';
import { MatchServerRank } from '../../enums/matchserverrank.enum';
import { MatchArchiveDeathsCollection } from './matcharchive-deaths.collection';
import { MatchArchiveKillsCollection } from './matcharchive-kills.collection';

export class MatchArchiveKDCollection extends MatchArchiveCollection {
  constructor(kills: MatchArchiveKillsCollection, deaths: MatchArchiveDeathsCollection) {
    super([]);
    kills.archive.forEach((val, i) => {
      const relatedDeathsObj = deaths.archive[i];
      const kdObj = {
        snapshot_time: val.snapshot_time,
        kd: {
          red: parseFloat((val.kills.red / relatedDeathsObj.deaths.red).toFixed(4)),
          blue: parseFloat((val.kills.blue / relatedDeathsObj.deaths.blue).toFixed(4)),
          green: parseFloat((val.kills.green / relatedDeathsObj.deaths.green).toFixed(4)),
        },
      };

      this.archive.push(kdObj);
    });
  }

  flattenTo(rank: MatchServerRank) {
    return this.archive
      .map((ma: IMatchArchive) => ma.kd[rank]);
  }
}
