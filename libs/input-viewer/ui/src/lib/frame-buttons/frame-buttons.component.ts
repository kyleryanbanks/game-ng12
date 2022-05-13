import { Component, Input } from '@angular/core';
import { Buttons } from '@game-ng12/game-loop';

@Component({
  selector: 'ft-frame-buttons',
  template: `
    <img *ngIf="buttons?.LP" src="assets/input-viewer/LightPunch.png" />
    <img *ngIf="buttons?.HP" src="assets/input-viewer/HeavyPunch.png" />
    <img *ngIf="buttons?.LK" src="assets/input-viewer/LightKick.png" />
    <img *ngIf="buttons?.HK" src="assets/input-viewer/HeavyKick.png" />
    <img *ngIf="buttons?.TAG" src="assets/input-viewer/Tag.png" />
    <img *ngIf="buttons?.STONE" src="assets/input-viewer/Surge.png" />
  `,

  styles: [
    `
      img {
        height: 36px;
        width: auto;
      }
    `,
  ],
})
export class FrameButtonsComponent {
  @Input() buttons?: Buttons | null;
}
