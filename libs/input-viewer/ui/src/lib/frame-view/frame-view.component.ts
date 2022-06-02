import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Frame, GameLoopService, HeldFrame } from '@game-ng12/game-loop';
import { RecordingsStore, State } from '@game-ng12/recorder/data';
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

    <label for="name"
      >Name:
      <input type="text" [formControl]="name" />
    </label>
    <button (click)="onSave()">Save</button>
    <button (click)="onReset()">Reset</button>
    <button (click)="onStop()">Stop</button>

    <div *ngIf="this.frame$ | async as frame">
      <ft-frame-direction [buttons]="frame.buttons"></ft-frame-direction>
      <ft-frame-buttons [buttons]="frame.buttons"></ft-frame-buttons>
    </div>

    <section>
      <div *ngFor="let frame of frames">
        <ft-frame-direction [buttons]="frame.buttons"></ft-frame-direction>
        <ft-frame-buttons [buttons]="frame.buttons"></ft-frame-buttons>
        <strong>{{ frame.hold }}</strong>
      </div>
    </section>

    <pre>{{ recordingsState | async | json }}</pre>
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
export class FrameViewComponent implements OnInit, OnDestroy {
  now = performance.now();
  frame$: Observable<Frame>;
  delay = new FormControl(16);
  name = new FormControl('');
  subscription = new Subscription();
  recorder = new Subscription();
  frames: HeldFrame[] = [];
  recordingsState: Observable<State>;
  @Input() controllerId = 0;

  constructor(
    private gameLoop: GameLoopService,
    public recordings: RecordingsStore
  ) {
    this.frame$ = this.gameLoop.getButtonsPerFrame(this.controllerId);
    this.recordingsState = this.recordings.select((state) => state);
  }

  ngOnInit() {
    this.subscription.add(
      this.delay.valueChanges.subscribe((delay: number) => {
        this.gameLoop.msDelay = delay;
      })
    );
    this.onReset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onReset() {
    this.frames = [];
    this.recorder?.unsubscribe();
    this.recorder = this.gameLoop
      .startRecordingControllerOnNextInput(this.controllerId)
      .subscribe((frames) => {
        this.frames = frames;
      });
  }

  onStop() {
    this.recorder?.unsubscribe();
  }

  onSave() {
    this.recordings.upsertRecording({
      frames: this.frames,
      id: this.name.value,
    });
  }
}
