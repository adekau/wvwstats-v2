import { MatchScores } from './matchscores.model';
import { MapScores } from './maps.model';

export interface Skirmish {
    id: number;
    scores: MatchScores;
    map_scores: MapScores[];
}
