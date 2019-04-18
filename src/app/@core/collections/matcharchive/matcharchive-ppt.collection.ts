import { MatchArchiveCollection } from './matcharchive.collection';
import { IMatchArchive } from '../../models/matcharchive.model';
import { MatchServerRank } from '../../enums/matchserverrank.enum';

export class MatchArchivePPTCollection extends MatchArchiveCollection {
  constructor(res: IMatchArchive[]) {
    super(res);
  }

  flattenTo(rank: MatchServerRank) {
    return this.archive
      .map((ma: IMatchArchive) => ma.ppt[rank]);
  }
}
