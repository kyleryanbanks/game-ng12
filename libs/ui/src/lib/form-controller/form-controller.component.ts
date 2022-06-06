import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  XUSB_BUTTON,
  XUSB_DPAD_DIRECTIONS,
} from '@game-ng12/controller/shared';
import { HeldFrame } from '@game-ng12/game-loop';

@Component({
  selector: 'fam-form-controller',
  templateUrl: './form-controller.component.html',
  styleUrls: ['./form-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControllerComponent {
  _DIR = XUSB_DPAD_DIRECTIONS;
  _BTN = XUSB_BUTTON;
  controller: FormGroup;

  @Output() frame = new EventEmitter<HeldFrame>();

  constructor(fb: FormBuilder) {
    this.controller = fb.group({
      hold: [1],
      direction: [0],
      leftTrigger: [false],
      rightTrigger: [false],
      buttons: fb.group({
        RIGHT_THUMB: [false],
        LEFT_THUMB: [false],
        START: [false],
        BACK: [false],
        RIGHT_SHOULDER: [false],
        LEFT_SHOULDER: [false],
        X: [false],
        Y: [false],
        A: [false],
        B: [false],
      }),
    });
  }

  onSubmit() {
    const buttonsObject = this.controller.controls.buttons.value as Record<
      keyof typeof XUSB_BUTTON,
      boolean
    >;

    const buttonInputs = (
      Object.entries(buttonsObject) as unknown as Array<[XUSB_BUTTON, boolean]>
    ).reduce<number>((wButtons, [name, value]) => {
      if (value) {
        return wButtons | (XUSB_BUTTON[name] as unknown as number);
      } else {
        return wButtons & ~XUSB_BUTTON[name];
      }
    }, 0);

    const direction = this.controller.controls.direction.value;
    const buttons = buttonInputs | direction;

    const hold = this.controller.controls.hold.value;
    const leftTrigger = this.controller.controls.leftTrigger.value ? 100 : 0;
    const rightTrigger = this.controller.controls.rightTrigger.value ? 100 : 0;

    this.frame.emit({ buttons, hold, leftTrigger, rightTrigger });

    this.controller.reset({
      hold: 1,
      direction: 0,
      leftTrigger: false,
      rightTrigger: false,
      buttons: {
        RIGHT_THUMB: false,
        LEFT_THUMB: false,
        START: false,
        BACK: false,
        RIGHT_SHOULDER: false,
        LEFT_SHOULDER: false,
        X: false,
        Y: false,
        A: false,
        B: false,
      },
    });
  }
}
