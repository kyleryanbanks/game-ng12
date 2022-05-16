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
      direction: [8],
      buttons: fb.group({
        THUMB_RIGHT: [false],
        THUMB_LEFT: [false],
        OPTIONS: [false],
        SHARE: [false],
        TRIGGER_RIGHT: [false],
        TRIGGER_LEFT: [false],
        SHOULDER_RIGHT: [false],
        SHOULDER_LEFT: [false],
        TRIANGLE: [false],
        CIRCLE: [false],
        CROSS: [false],
        SQUARE: [false],
      }),
    });
  }

  onSubmit() {
    console.log(this.controller);
    const buttonsObject = this.controller.controls.buttons.value as Record<
      keyof typeof XUSB_BUTTON,
      boolean
    >;

    const buttonInputs = (
      Object.entries(buttonsObject) as unknown as Array<[XUSB_BUTTON, boolean]>
    ).reduce<number>((wButtons, [name, value]) => {
      if (value) {
        return wButtons | (XUSB_BUTTON[name] as any);
      } else {
        return wButtons & ~XUSB_BUTTON[name];
      }
    }, 0);

    const direction = this.controller.controls.direction.value;
    const buttons = buttonInputs | direction;

    const hold = this.controller.controls.hold.value;

    this.frame.emit({ buttons, hold });

    this.controller.reset({
      hold: 1,
      direction: 8,
      buttons: {
        THUMB_RIGHT: false,
        THUMB_LEFT: false,
        OPTIONS: false,
        SHARE: false,
        TRIGGER_RIGHT: false,
        TRIGGER_LEFT: false,
        SHOULDER_RIGHT: false,
        SHOULDER_LEFT: false,
        TRIANGLE: false,
        CIRCLE: false,
        CROSS: false,
        SQUARE: false,
      },
    });
  }
}
