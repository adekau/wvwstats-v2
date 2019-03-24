import { Observable } from 'rxjs';
import { MatchWorlds, MatchAllWorlds } from './matchworlds.model';
import { MatchKills } from './matchkills.model';
import { MatchDeaths } from './matchdeaths.model';
import { MatchVictoryPoints } from './matchvictorypoints.model';
import { Skirmish } from './skirmish.model';
import { Map } from './maps.model';
import { GW2Region } from '../enums/gw2region.enum';

export interface IMatch {
    id: string;
    start_time: string;
    end_time: string;
    worlds: MatchWorlds;
    all_worlds?: MatchAllWorlds;
    kills: MatchKills;
    deaths: MatchDeaths;
    victory_points?: MatchVictoryPoints;
    skirmishes?: Skirmish[];
    maps: Map[];
}

export abstract class MatchData {
    abstract get matches(): Observable<AllMatches>;
    abstract requestMatches(): Observable<AllMatches>;
}

export class Match implements IMatch {
    id: string;
    start_time: string;
    end_time: string;
    worlds: MatchWorlds;
    all_worlds?: MatchAllWorlds;
    kills: MatchKills;
    deaths: MatchDeaths;
    victory_points?: MatchVictoryPoints;
    skirmishes?: Skirmish[];
    maps: Map[];

    constructor(match: IMatch) {
        this.id = match.id;
        this.start_time = match.start_time;
        this.end_time = match.end_time;
        this.worlds = match.worlds;
        this.all_worlds = match.all_worlds;
        this.kills = match.kills;
        this.deaths = match.deaths;
        this.maps = match.maps;

        if (match.victory_points) {
            this.victory_points = match.victory_points;
        }

        if (match.all_worlds) {
            this.all_worlds = match.all_worlds;
        }

        if (match.skirmishes) {
            this.skirmishes = match.skirmishes;
        }
    }

    get start() {
        return new Date(this.start_time);
    }

    get end() {
        return new Date(this.end_time);
    }
}

export class AllMatches {
    matches: Match[];

    constructor(response: IMatch[]) {
        this.matches = response.map((match: IMatch) => new Match(match));
    }

    find(region: GW2Region, tier: number): Match {
        const matchId = `${region.valueOf()}-${tier}`;
        return this.matches.filter(match => matchId === match.id)[0];
    }
}
