import { Observable } from 'rxjs';

export interface Match {
    
}

export abstract class MatchData {
    abstract get matches(): Observable<Match[]>;
    abstract requestMatches(): Observable<Match[]>;
}