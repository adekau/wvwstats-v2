import { MatchArchiveCollection } from './matcharchive.collection';
import { IMatchArchive } from '../../models/matcharchive.model';
import { MatchServerRank } from '../../enums/matchserverrank.enum';

export class MatchArchiveDeathsCollection extends MatchArchiveCollection {
  constructor(res: IMatchArchive[]) {
    super(res);
  }

  flattenTo(rank: MatchServerRank) {
    return this.archive
      .map((ma: IMatchArchive) => ma.deaths[rank]);
  }

  get snapshotTimes() {
    return this.archive.map((ma: IMatchArchive) => ma.snapshot_time);
  }
}
