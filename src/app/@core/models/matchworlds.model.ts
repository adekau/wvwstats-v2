import { World, IWorld } from './world.model';
import { WorldCollection } from '../collections/world.collection';

export interface IMatchWorlds {
    red: number;
    blue: number;
    green: number;
}

export interface IMatchAllWorlds {
    red: Array<number>;
    blue: Array<number>;
    green: Array<number>;
}

export class MatchWorlds {
    red: IWorld;
    blue: IWorld;
    green: IWorld;

    constructor(worlds: IMatchWorlds, matchworlds: WorldCollection) {
        this.red = matchworlds.find(worlds.red);
        this.blue = matchworlds.find(worlds.blue);
        this.green = matchworlds.find(worlds.green);
    }
}

export class MatchAllWorlds {
    red: WorldCollection;
    blue: WorldCollection;
    green: WorldCollection;

    constructor(worlds: IMatchAllWorlds, matchworlds: WorldCollection) {
        this.red = matchworlds.subset(...worlds.red);
        this.blue = matchworlds.subset(...worlds.blue);
        this.green = matchworlds.subset(...worlds.green);
    }
}
