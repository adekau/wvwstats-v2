import { IMatchArchive } from '../../models/matcharchive.model';
import { MatchServerRank } from '../../enums/matchserverrank.enum';

export class MatchArchiveCollection {
  private _archive: IMatchArchive[] = [];

  constructor(res: IMatchArchive[]) {
    this._archive = res;
  }

  get archive(): IMatchArchive[] {
    return this._archive;
  }

  flattenTo(rank: MatchServerRank) { }
 
  get snapshotTimes() {
    return this.archive.map((ma: IMatchArchive) => ma.snapshot_time);
  }
}
