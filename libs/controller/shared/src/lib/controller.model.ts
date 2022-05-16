/* eslint-disable @typescript-eslint/no-explicit-any */
export enum XUSB_BUTTON {
  DPAD_UP = 1 << 1,
  DPAD_DOWN = 1 << 2,
  DPAD_LEFT = 1 << 3,
  DPAD_RIGHT = 1 << 4,
  START = 1 << 5,
  BACK = 1 << 6,
  LEFT_THUMB = 1 << 7,
  RIGHT_THUMB = 1 << 8,
  LEFT_SHOULDER = 1 << 9,
  RIGHT_SHOULDER = 1 << 10,
  GUIDE = 1 << 11,
  A = 1 << 12,
  B = 1 << 13,
  X = 1 << 14,
  Y = 1 << 15,
}

export enum DS4_BUTTONS {
  HUMB_RIGHT = 1 << 15,
  THUMB_LEFT = 1 << 14,
  OPTIONS = 1 << 13,
  SHARE = 1 << 12,
  TRIGGER_RIGHT = 1 << 11,
  TRIGGER_LEFT = 1 << 10,
  SHOULDER_RIGHT = 1 << 9,
  SHOULDER_LEFT = 1 << 8,
  TRIANGLE = 1 << 7,
  CIRCLE = 1 << 6,
  CROSS = 1 << 5,
  SQUARE = 1 << 4,
}

export enum DS4_SPECIAL_BUTTONS {
  SPECIAL_PS = 1 << 0,
  SPECIAL_TOUCHPAD = 1 << 1,
}

export enum DS4_DPAD_DIRECTIONS {
  DPAD_NONE = 0x8,
  DPAD_NORTHWEST = 0x7,
  DPAD_WEST = 0x6,
  DPAD_SOUTHWEST = 0x5,
  DPAD_SOUTH = 0x4,
  DPAD_SOUTHEAST = 0x3,
  DPAD_EAST = 0x2,
  DPAD_NORTHEAST = 0x1,
  DPAD_NORTH = 0x0,
}

export enum VIGEM_ERRORS {
  'VIGEM_ERROR_NONE' = 0x20000000,
  'VIGEM_ERROR_BUS_NOT_FOUND' = 0xe0000001,
  'VIGEM_ERROR_NO_FREE_SLOT' = 0xe0000002,
  'VIGEM_ERROR_INVALID_TARGET' = 0xe0000003,
  'VIGEM_ERROR_REMOVAL_FAILED' = 0xe0000004,
  'VIGEM_ERROR_ALREADY_CONNECTED' = 0xe0000005,
  'VIGEM_ERROR_TARGET_UNINITIALIZED' = 0xe0000006,
  'VIGEM_ERROR_TARGET_NOT_PLUGGED_IN' = 0xe0000007,
  'VIGEM_ERROR_BUS_VERSION_MISMATCH' = 0xe0000008,
  'VIGEM_ERROR_BUS_ACCESS_FAILED' = 0xe0000009,
  'VIGEM_ERROR_CALLBACK_ALREADY_REGISTERED' = 0xe0000010,
  'VIGEM_ERROR_CALLBACK_NOT_FOUND' = 0xe0000011,
  'VIGEM_ERROR_BUS_ALREADY_CONNECTED' = 0xe0000012,
  'VIGEM_ERROR_BUS_INVALID_HANDLE' = 0xe0000013,
  'VIGEM_ERROR_XUSB_USERINDEX_OUT_OF_RANGE' = 0xe0000014,
}

export interface ReportObject {
  wButtons: DS4_BUTTONS | DS4_DPAD_DIRECTIONS;
  bThumbLX: number;
  bThumbLY: number;
  bThumbRX: number;
  bThumbRY: number;
  bTriggerL: number;
  bTriggerR: number;
  bSpecial: DS4_SPECIAL_BUTTONS;
}

export interface DS4InputReport {
  reportObj: ReportObject;
  _dpadH: number;
  _dpadV: number;
  updateButton: (name: string, value: boolean) => void;
  updateAxis: (name: string, value: boolean) => void;

  getButtonValue: (name: DS4_BUTTONS) => boolean;
  getAxisValue: (name: DS4_BUTTONS) => number;

  reset: () => void;
}

export interface InputButton {
  name: string;
  parent: ViGEmTarget<any, any>;
  setValue(value: boolean): void;
}

export interface InputAxis {
  name: string;
  parent: ViGEmTarget<any, any>;
  value: number;
  minValue: number;
  maxValue: number;
  setValue(value: number): null | Error;
}

type TDS4Buttons = keyof (typeof DS4_BUTTONS & typeof DS4_SPECIAL_BUTTONS);
type TDS4Axis =
  | 'leftX'
  | 'leftY'
  | 'rightX'
  | 'rightY'
  | 'leftTrigger'
  | 'rightTrigger'
  | 'dpadHorz'
  | 'dpadVert';

export interface ViGEmTarget<B extends string, A extends string> {
  get vendorID(): number;
  get productID(): number;
  get index(): number;
  get type(): string;
  get attached(): boolean;
  get updateMode(): 'auto' | 'manual';
  get button(): { readonly [key in B]: InputButton };
  get axis(): { readonly [key in A]: InputAxis };

  connect(): null | Error;
  disconnect(): null | Error;
  update(): void;
  resetInputs(): void;
}

export interface DS4Controller extends ViGEmTarget<TDS4Buttons, TDS4Axis> {
  _report: DS4InputReport;
}

export interface Term {
  input: number;
  hold: number;
}
