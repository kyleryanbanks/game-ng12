import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DS4_BUTTONS, DS4_DPAD_DIRECTIONS } from '@game-ng12/controller';

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
  lastFrame = {};

  @Output() frame = new EventEmitter<number>();

  constructor(fb: FormBuilder) {
    this.controller = fb.group({
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
    const wButtons = buttonInputs | direction;

    this.lastFrame = wButtons;

    this.frame.emit(wButtons);

    this.controller.reset({
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
