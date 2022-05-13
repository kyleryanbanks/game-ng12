import { Component } from '@angular/core';
import { Buttons, Frame, GameLoopService } from '@game-ng12/game-loop';
import { Observable } from 'rxjs';

@Component({
  selector: 'ft-frame-view',
  template: `
    <div>
      <ft-frame-direction [direction]="direction$ | async"></ft-frame-direction>
      <ft-frame-buttons [buttons]="buttons$ | async"></ft-frame-buttons>
    </div>

    <section>
      <div *ngFor="let frame of frames$ | async">
        <ft-frame-direction [direction]="frame.direction"></ft-frame-direction>
        <ft-frame-buttons [buttons]="frame.buttons"></ft-frame-buttons>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      section {
        display: flex;
        flex-direction: column-reverse;
      }
    `,
  ],
})
export class FrameViewComponent {
  buttons$: Observable<Buttons>;
  direction$: Observable<number>;
  frames$: Observable<Frame[]>;

  constructor(private gameLoop: GameLoopService) {
    this.buttons$ = this.gameLoop.getMappedButtons();
    this.direction$ = this.gameLoop.getDirection();
    this.frames$ = this.gameLoop.getInputs();
  }
}
