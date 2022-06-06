import { Component, Input } from '@angular/core';
import { Button, XUSB_BUTTONS } from '@game-ng12/controller/shared';

@Component({
  selector: 'ft-xbox-buttons',
  template: `
    <strong *ngIf="hold">{{ hold }}</strong>
    <ng-container *ngFor="let input of inputs">
      <div
        *ngIf="checkButtonsAndValue(input.value)"
        [ngStyle]="{
          'background-color': input.color,
          'border-radius': input.round ? '50%' : '10%'
        }"
      >
        {{ input.name }}
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
      }

      div,
      strong {
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        margin: 0.2rem;
      }
    `,
  ],
})
export class XboxButtonsComponent {
  inputs: Button[] = XUSB_BUTTONS;
  @Input() buttons = 0;
  @Input() hold?: number;

  checkButtonsAndValue(value: number) {
    return this.buttons & value;
  }
}
