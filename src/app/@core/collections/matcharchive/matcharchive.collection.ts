import { IMatchArchive } from '../../models/matcharchive.model';

export class MatchArchiveCollection {
  private _archive: IMatchArchive[] = [];

  constructor(res: IMatchArchive[]) {
    this._archive = res;
  }

  get archive(): IMatchArchive[] {
    return this._archive;
  }
}
