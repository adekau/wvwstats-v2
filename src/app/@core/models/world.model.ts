import { Observable } from 'rxjs';
import { WorldCollection } from '../collections/world.collection';

export interface IWorld {
    id: number;
    name: string;
    population: string;
}

export class World implements IWorld {
    id: number;
    name: string;
    population: string;

    constructor(world: IWorld) {
        this.id = world.id;
        this.name = world.name;
        this.population = world.population;
    }
}

export abstract class WorldData {
    abstract requestWorlds(): Observable<WorldCollection>;
    abstract get worlds(): Observable<WorldCollection>;
}
