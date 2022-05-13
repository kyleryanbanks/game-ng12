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

export interface Frame {
  direction: number;
  buttons: Buttons;
}
