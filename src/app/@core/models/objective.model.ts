export interface IObjective {
    id: string;
    owner?: string;
    last_flipped?: string;
    claimed_by?: string;
    claimed_at?: string;
    points_tick?: number;
    points_capture?: number;
    guild_upgrades?: number[];
    yaks_delivered?: number;
}

interface ISingleObjectiveCount {
    red: number;
    blue: number;
    green: number;
}

export interface IObjectiveCount {
    camps: ISingleObjectiveCount;
    towers: ISingleObjectiveCount;
    keeps: ISingleObjectiveCount;
    castles: ISingleObjectiveCount;
}