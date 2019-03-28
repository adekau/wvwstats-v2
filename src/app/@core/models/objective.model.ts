import { Observable } from 'rxjs';
import { ObjectiveCollection } from '../collections/objective.collection';

export interface IObjective {
  id: string;
  name?: string;
  type?: string;
  sector_id?: number;
  map_id?: number;
  map_type?: string;
  coord?: [number, number, number];
  label_coord?: [number, number];
  owner?: string;
  last_flipped?: string;
  claimed_by?: string;
  claimed_at?: string;
  points_tick?: number;
  points_capture?: number;
  guild_upgrades?: number[];
  yaks_delivered?: number;
  marker?: string;
  chat_link?: string;
  upgrade_id?: number;
}

interface ISingleObjectiveCount {
  red: number;
  blue: number;
  green: number;
}

export interface IObjectiveCount {
  camp: ISingleObjectiveCount;
  tower: ISingleObjectiveCount;
  keep: ISingleObjectiveCount;
  castle: ISingleObjectiveCount;
}

export interface IWorldObjectiveCount {
  camp: number;
  tower: number;
  keep: number;
  castle: number;
}

export abstract class ObjectiveData {
  abstract requestData(): Observable<ObjectiveCollection>;
  abstract get objectives(): Observable<ObjectiveCollection>;
}

export class Objective implements IObjective {
  id: string;
  name?: string;
  type?: string;
  sector_id?: number;
  map_id?: number;
  map_type?: string;
  coord?: [number, number, number];
  label_coord?: [number, number];
  owner?: string;
  last_flipped?: string;
  claimed_by?: string;
  claimed_at?: string;
  points_tick?: number;
  points_capture?: number;
  guild_upgrades?: number[];
  yaks_delivered?: number;
  marker?: string;
  chat_link?: string;
  upgrade_id?: number;

  constructor(objective: IObjective) {
    this.id = objective.id;
    if (objective.name) {
      this.name = objective.name;
    }
    if (objective.type) {
      this.type = objective.type;
    }
    if (objective.sector_id) {
      this.sector_id = objective.sector_id;
    }
    if (objective.map_id) {
      this.map_id = objective.map_id;
    }
    if (objective.map_type) {
      this.map_type = objective.map_type;
    }
    if (objective.coord) {
      this.coord = objective.coord;
    }
    if (objective.label_coord) {
      this.label_coord = objective.label_coord;
    }
    if (objective.owner) {
      this.owner = objective.owner;
    }
    if (objective.last_flipped) {
      this.last_flipped = objective.last_flipped;
    }
    if (objective.claimed_by) {
      this.claimed_by = objective.claimed_by;
    }
    if (objective.claimed_at) {
      this.claimed_at = objective.claimed_at;
    }
    if (objective.points_tick) {
      this.points_tick = objective.points_tick;
    }
    if (objective.points_capture) {
      this.points_capture = objective.points_capture;
    }
    if (objective.guild_upgrades) {
      this.guild_upgrades = objective.guild_upgrades;
    }
    if (objective.yaks_delivered) {
      this.yaks_delivered = objective.yaks_delivered;
    }
    if (objective.marker) {
      this.marker = objective.marker;
    }
    if (objective.chat_link) {
      this.chat_link = objective.chat_link;
    }
    if (objective.upgrade_id) {
      this.upgrade_id = objective.upgrade_id;
    }
  }
}
