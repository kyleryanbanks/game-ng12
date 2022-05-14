import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Frame, GameLoopService } from '@game-ng12/game-loop';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ft-frame-view',
  template: `
    <input
      [formControl]="delay"
      [value]="delay.value"
      id="delay"
      type="range"
      min="1"
      max="32"
      step="0.1"
    />
    <label for="delay"
      >Delay(ms):
      <input
        type="number"
        step="0.1"
        [formControl]="delay"
        [value]="delay.value"
      />
    </label>

    <div *ngIf="this.frame$ | async as frame">
      <ft-frame-direction
        [direction]="frame.cardinalDirection"
      ></ft-frame-direction>
      <ft-frame-buttons [buttons]="frame.buttons"></ft-frame-buttons>
    </div>

    <section>
      <div *ngFor="let frame of frames$ | async">
        <ft-frame-direction
          [direction]="frame.cardinalDirection"
        ></ft-frame-direction>
        <ft-frame-buttons [buttons]="frame.buttons"></ft-frame-buttons>
        <strong>{{ frame.hold }}</strong>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }

      section {
        display: flex;
        flex-direction: column-reverse;
      }
    `,
  ],
})
export class FrameViewComponent implements OnInit {
  now = performance.now();
  frame$: Observable<Frame>;
  frames$: Observable<Frame[]>;
  delay = new FormControl(16);
  subscription = new Subscription();

  constructor(private gameLoop: GameLoopService) {
    this.frame$ = this.gameLoop.getButtonsPerFrame();
    this.frames$ = this.gameLoop.getInputHistoryWithHold();
  }

  ngOnInit() {
    this.subscription.add(
      this.delay.valueChanges.subscribe((delay: number) => {
        this.gameLoop.msDelay = delay;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
