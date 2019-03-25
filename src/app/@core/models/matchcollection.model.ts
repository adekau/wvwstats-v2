import { Match, IMatch } from './match.model';
import { GW2Region } from '../enums/gw2region.enum';

export class MatchCollection {
    matches: Match[] = [];

    constructor(response: IMatch[] = []) {
        this.matches = response.map((match: IMatch) => new Match(match));
    }

    find(region: GW2Region, tier: number): Match {
        const matchId = `${region.valueOf()}-${tier}`;
        return this.matches.filter(
            match => matchId === match.id,
        )[0];
    }

    region(region: GW2Region): MatchCollection {
        const matchId = `${region.valueOf()}-`;
        return new MatchCollection(
            this.matches.filter(
                match => match.id.startsWith(matchId),
            ),
        );
    }

    get empty() {
        return !this.matches.length;
    }

    get length() {
        return this.matches.length;
    }

    all() {
        return this.matches;
    }
}
