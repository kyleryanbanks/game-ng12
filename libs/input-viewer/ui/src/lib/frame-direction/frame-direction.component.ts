import { Component, Input } from '@angular/core';

@Component({
  selector: 'ft-frame-direction',
  template: `
    <img
      *ngIf="direction && direction !== null"
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
  @Input() direction?: number | null;
}
