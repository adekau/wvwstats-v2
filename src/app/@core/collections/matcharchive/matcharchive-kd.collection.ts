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
          red: val.kills.red / relatedDeathsObj.deaths.red,
          blue: val.kills.blue / relatedDeathsObj.deaths.blue,
          green: val.kills.green / relatedDeathsObj.deaths.green,
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
