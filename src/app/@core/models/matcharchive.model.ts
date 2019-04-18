import { IMatchScores } from './matchscores.model';
import { MatchKills } from './matchkills.model';
import { MatchDeaths } from './matchdeaths.model';
import { Match } from './match.model';
import { Observable } from 'rxjs';
import { IMatchPPT } from './matchppt.model';

export interface IMatchArchive {
  snapshot_time: string;
  scores?: IMatchScores;
  kills?: MatchKills;
  deaths?: MatchDeaths;
  kd?: any;
  ppt?: IMatchPPT;
}

export abstract class MatchArchiveData {
  abstract scores(match: Match): any;
  abstract requestMatchArchive(data: string, match: Match):
    Observable<Array<IMatchArchive>>;
}
