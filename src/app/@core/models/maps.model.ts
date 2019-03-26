import { MatchScores } from './matchscores.model';
import { MapBonus } from './mapbonus.model';
import { Objective } from './objective.model';
import { MatchDeaths } from './matchdeaths.model';
import { MatchKills } from './matchkills.model';

export interface MapScores {
    type: string;
    scores: MatchScores;
}

export interface Map {
    id: number;
    type: string;
    scores: MatchScores;
    bonuses?: MapBonus[];
    objectives: Objective[];
    deaths?: MatchDeaths;
    kills?: MatchKills;
}
