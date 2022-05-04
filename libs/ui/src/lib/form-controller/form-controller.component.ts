import { ChangeDetectionStrategy, Component } from '@angular/core';
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
}
