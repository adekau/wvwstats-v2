import { MatchScores } from './matchscores.model';
import { IMapScores } from './maps.model';

export interface Skirmish {
    id: number;
    scores: MatchScores;
    map_scores: IMapScores[];
}
