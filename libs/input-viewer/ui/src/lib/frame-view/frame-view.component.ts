import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  HeldFrame,
  RealTimeFrame,
  RealTimeInputsService,
} from '@game-ng12/game-loop';
import { RecordingsStore, State } from '@game-ng12/recorder/data';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'ft-frame-view',
  template: `
    <h2>Controller: {{ controllerId }}</h2>
    <input
      [formControl]="fps"
      [value]="fps.value"
      id="fps"
      type="range"
      min="30"
      max="90"
      step="1"
    />
    <label for="fps"
      >Display FPS:
      <input type="number" step="1" [formControl]="fps" [value]="fps.value" />
    </label>

    <label for="name"
      >Name:
      <input type="text" [formControl]="name" />
    </label>
    <button (click)="onSave()">Save</button>
    <button (click)="onReset()">Reset</button>
    <button (click)="onStop()">Stop</button>

    <div *ngIf="this.frame$ | async as frame">
      <ft-xbox-buttons
        [buttons]="frame.buttons"
        [leftTrigger]="frame.leftTrigger"
        [rightTrigger]="frame.rightTrigger"
      ></ft-xbox-buttons>
    </div>

    <section>
      <div *ngFor="let frame of frames">
        <ft-xbox-buttons
          [buttons]="frame.buttons"
          [leftTrigger]="frame.leftTrigger"
          [rightTrigger]="frame.rightTrigger"
          [hold]="frame.hold * fps.value"
        ></ft-xbox-buttons>
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
        gap: 0.5rem;
      }

      h2 {
        text-align: center;
      }
    `,
  ],
})
export class FrameViewComponent implements OnInit, OnDestroy {
  now = performance.now();
  frame$: Observable<RealTimeFrame> = of({
    buttons: 0,
    time: 0,
    leftTrigger: 0,
    rightTrigger: 0,
  });
  fps = new FormControl(60);
  name = new FormControl('');
  subscription = new Subscription();
  recorder = new Subscription();
  frames: HeldFrame[] = [];
  recordingsState: Observable<State>;
  @Input() controllerId!: number;

  constructor(
    private inputs: RealTimeInputsService,
    public recordings: RecordingsStore
  ) {
    this.recordingsState = this.recordings.select((state) => state);
  }

  ngOnInit() {
    this.frame$ = this.inputs.getTimedButtons(this.controllerId);
    this.onReset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onReset() {
    this.frames = [];
    this.recorder?.unsubscribe();
    this.recorder = this.inputs
      .startRecordingControllerOnNextInput(this.controllerId)
      .subscribe((frames) => {
        this.frames = frames;
      });
  }

  onStop() {
    this.recorder?.unsubscribe();
  }

  onSave() {
    console.log(this.frames);
    this.recordings.upsertRecording({
      frames: this.frames,
      id: this.name.value,
    });
  }
}
