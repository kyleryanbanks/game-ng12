import { Component, Input } from '@angular/core';
import { Button, XUSB_BUTTONS } from '@game-ng12/controller/shared';

@Component({
  selector: 'ft-xbox-buttons',
  template: `
    <strong *ngIf="hold">{{ hold | number: '1.0-0' }}</strong>
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
    <div class="trigger" *ngIf="leftTrigger">LT</div>
    <div class="trigger" *ngIf="rightTrigger">RT</div>
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

      .trigger {
        background-color: darkslateblue;
        border-radius: 50%;
      }
    `,
  ],
})
export class XboxButtonsComponent {
  inputs: Button[] = XUSB_BUTTONS;
  @Input() buttons = 0;
  @Input() leftTrigger = 0;
  @Input() rightTrigger = 0;
  @Input() hold?: number;

  checkButtonsAndValue(value: number) {
    return this.buttons & value;
  }
}
