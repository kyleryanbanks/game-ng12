import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DS4_BUTTONS,
  DS4_DPAD_DIRECTIONS,
  Term,
} from '@game-ng12/controller/shared';

@Component({
  selector: 'fam-form-controller',
  templateUrl: './form-controller.component.html',
  styleUrls: ['./form-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControllerComponent {
  _DIR = DS4_DPAD_DIRECTIONS;
  _BTN = DS4_BUTTONS;
  controller: FormGroup;
  lastInput = {};

  @Output() frame = new EventEmitter<Term>();

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
    const buttons = this.controller.controls.buttons.value as Record<
      keyof typeof DS4_BUTTONS,
      boolean
    >;

    const buttonInputs = (
      Object.entries(buttons) as unknown as Array<[DS4_BUTTONS, boolean]>
    ).reduce<number>((wButtons, [name, value]) => {
      if (value) {
        return wButtons | (DS4_BUTTONS[name] as any);
      } else {
        return wButtons & ~DS4_BUTTONS[name];
      }
    }, 0);

    const direction = this.controller.controls.direction.value;
    const input = buttonInputs | direction;
    this.lastInput = input;

    const hold = this.controller.controls.hold.value;

    this.frame.emit({ input, hold });

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
