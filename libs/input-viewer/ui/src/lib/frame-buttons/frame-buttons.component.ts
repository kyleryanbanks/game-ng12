import { Component, Input } from '@angular/core';
import { MVCIMap } from '@game-ng12/game-loop';

@Component({
  selector: 'ft-frame-buttons',
  template: `
    <img *ngIf="checkButton(map.LP)" src="assets/input-viewer/LightPunch.png" />
    <img *ngIf="checkButton(map.HP)" src="assets/input-viewer/HeavyPunch.png" />
    <img *ngIf="checkButton(map.LK)" src="assets/input-viewer/LightKick.png" />
    <img *ngIf="checkButton(map.HK)" src="assets/input-viewer/HeavyKick.png" />
    <img *ngIf="checkButton(map.TAG)" src="assets/input-viewer/Tag.png" />
    <img *ngIf="checkButton(map.STONE)" src="assets/input-viewer/Surge.png" />
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
  map = MVCIMap;
  @Input() buttons = 0;

  checkButton(mappingShift: number) {
    return this.buttons & (1 << mappingShift);
  }
}
