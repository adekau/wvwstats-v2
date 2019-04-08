import { MatchArchiveCollection } from './matcharchive.collection';
import { IMatchArchive } from '../../models/matcharchive.model';
import { MatchServerRank } from '../../enums/matchserverrank.enum';

export class MatchArchiveScoresCollection extends MatchArchiveCollection {
  constructor(res: IMatchArchive[]) {
    super(res);
  }

  flattenTo(rank: MatchServerRank) {
    return this.archive
      .map((ma: IMatchArchive) => ma.scores[rank]);
  }
}
