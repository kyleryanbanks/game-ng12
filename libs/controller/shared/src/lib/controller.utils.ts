import { XUSB_BUTTON } from './controller.model';

export const deriveCardinalDirectionFromButtons = (buttons: number) => {
  const UP = buttons & XUSB_BUTTON.DPAD_UP;
  const DOWN = buttons & XUSB_BUTTON.DPAD_DOWN;
  const LEFT = buttons & XUSB_BUTTON.DPAD_LEFT;
  const RIGHT = buttons & XUSB_BUTTON.DPAD_RIGHT;

  if (UP && !RIGHT && !LEFT) {
    return 8;
  } else if (UP && RIGHT) {
    return 1;
  } else if (RIGHT && !UP && !DOWN) {
    return 2;
  } else if (DOWN && RIGHT) {
    return 3;
  } else if (DOWN && !RIGHT && !LEFT) {
    return 4;
  } else if (DOWN && LEFT) {
    return 5;
  } else if (LEFT && !UP && !DOWN) {
    return 6;
  } else if (UP && LEFT) {
    return 7;
  } else {
    return 0;
  }
};

export const swapBits = (n: number, p1: number, p2: number): number => {
  if (!(n & XUSB_BUTTON.DPAD_LEFT) && !(n & XUSB_BUTTON.DPAD_RIGHT)) {
    return n;
  }

  n ^= 1 << p1;
  n ^= 1 << p2;
  return n;
};
