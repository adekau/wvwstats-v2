import { Observable } from 'rxjs';

export interface Match {
    id: string;
}

export abstract class MatchData {
    abstract get matches(): Observable<Match[]>;
    abstract requestMatches(): Observable<Match[]>;
}
