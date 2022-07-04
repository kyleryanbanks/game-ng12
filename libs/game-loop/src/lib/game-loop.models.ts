import { XUSB_BUTTON } from '@game-ng12/controller/shared';

export interface IFrameData {
  frameStartTime: number;
  deltaTime: number;
}

export interface GamepadButtons {
  [index: string]: boolean;
}

export const GAMEPAD_TO_XUSB = [
  XUSB_BUTTON.A,
  XUSB_BUTTON.B,
  XUSB_BUTTON.X,
  XUSB_BUTTON.Y,
  XUSB_BUTTON.LEFT_SHOULDER,
  XUSB_BUTTON.RIGHT_SHOULDER,
  0,
  0,
  XUSB_BUTTON.BACK,
  XUSB_BUTTON.START,
  XUSB_BUTTON.RIGHT_THUMB,
  XUSB_BUTTON.LEFT_THUMB,
  XUSB_BUTTON.DPAD_UP,
  XUSB_BUTTON.DPAD_DOWN,
  XUSB_BUTTON.DPAD_LEFT,
  XUSB_BUTTON.DPAD_RIGHT,
];

export const GAMEPAD_TO_XUSB_MAP = [
  12, 13, 14, 15, 9, 10, -1, -1, 6, 5, 8, 7, 1, 2, 3, 4,
];

export const GAMEPAD_TO_DS4_MAP = [5, 6, 4, 7, 8, 9, 10, 11, 12, 13, 15, 14];

export enum GAMEPAD_API_BUTTONS {
  CROSS = 1 << 0,
  CIRCLE = 1 << 1,
  SQUARE = 1 << 2,
  TRIANGLE = 1 << 3,
  SHOULDER_LEFT = 1 << 4,
  SHOULDER_RIGHT = 1 << 5,
  TRIGGER_LEFT = 1 << 6,
  TRIGGER_RIGHT = 1 << 7,
  SHARE = 1 << 8,
  OPTIONS = 1 << 9,
  THUMB_RIGHT = 1 << 10,
  THUMB_LEFT = 1 << 11,
  UP = 1 << 12,
  DOWN = 1 << 13,
  LEFT = 1 << 14,
  RIGHT = 1 << 15,
}

export enum MVCIMap {
  LK = XUSB_BUTTON.X,
  HK = XUSB_BUTTON.Y,
  LP = XUSB_BUTTON.A,
  HP = XUSB_BUTTON.B,
  STONE = 256, // Using XUSB SHOULDER doesn't register as 256/512 in the input viewer?
  TAG = 512,
}

export interface Buttons {
  LP: boolean;
  HP: boolean;
  LK: boolean;
  HK: boolean;
  TAG: boolean;
  STONE: boolean;
}

export interface Inputs {
  buttons: number; // Bitfield of all gamepad APIs buttons pressed state
  leftTrigger: number;
  rightTrigger: number;
}

export interface RealTimeFrame extends Inputs {
  time: number;
}

export interface RealTimeData {
  context: AudioContext;
  time: number;
}

export interface RealTimeHeldFrame extends RealTimeFrame {
  hold: number;
}

export interface Frame extends Inputs {
  frame: number;
}

export interface HeldFrame extends Inputs {
  hold: number;
}
