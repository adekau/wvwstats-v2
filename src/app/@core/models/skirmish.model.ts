import { IMatchScores } from './matchscores.model';
import { IMapScores } from './maps.model';

export interface Skirmish {
    id: number;
    scores: IMatchScores;
    map_scores: IMapScores[];
}
