export interface IFrameData {
  frameStartTime: number;
  deltaTime: number;
}

export interface GamepadButtons {
  [index: string]: boolean;
}

export interface Buttons {
  LP: boolean;
  HP: boolean;
  LK: boolean;
  HK: boolean;
  TAG: boolean;
  STONE: boolean;
}

export enum MVCIMap {
  LK = 0,
  HK = 1,
  LP = 2,
  HP = 3,
  STONE = 4,
  TAG = 5,
}

export interface Frame {
  frame: number;
  hold?: number;
  cardinalDirection: number; // cardinal directions. 0 = up incrementing clockwise.
  buttons: number; // Bitfield of all gamepad APIs buttons pressed state
}
