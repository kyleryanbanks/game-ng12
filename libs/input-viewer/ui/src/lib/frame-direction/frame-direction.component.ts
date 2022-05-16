import { Component, Input } from '@angular/core';
import { deriveCardinalDirectionFromButtons } from '@game-ng12/controller/shared';

@Component({
  selector: 'ft-frame-direction',
  template: `
    <img
      *ngIf="direction"
      src="assets/input-viewer/Arrow.png"
      [style.transform]="'rotate(' + direction * 45 + 'deg)'"
    />
  `,
  styles: [
    `
      img {
        height: 36px;
        width: auto;
        margin-right: 10px;
      }
    `,
  ],
})
export class FrameDirectionComponent {
  direction = 0;

  @Input() set buttons(buttons: number) {
    this.direction = deriveCardinalDirectionFromButtons(buttons);
  }
}
