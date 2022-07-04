import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControllerService } from '@game-ng12/controller/data';
import { swapBits } from '@game-ng12/controller/shared';
import { RealTimeHeldFrame, realtimePlayback } from '@game-ng12/game-loop';
import { RecordingsStore } from '@game-ng12/recorder/data';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit, OnDestroy {
  frames: RealTimeHeldFrame[] = [];
  subscriptions = new Subscription();
  connected = false;
  asP2 = new FormControl(true);

  constructor(
    public controller: ControllerService,
    public recordings: RecordingsStore
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.controller.connected.subscribe((connected) => {
        this.connected = connected;
      })
    );
    this.subscriptions.add(
      this.asP2.valueChanges.subscribe(() => {
        this.frames = this.frames.map((frame) => ({
          ...frame,
          buttons: swapBits(frame.buttons, 2, 3),
        }));
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onLoad(id: string) {
    const recording = this.recordings.getFramesForSelectedRecording(id) || [];

    this.frames = this.asP2.value
      ? recording.map((frame) => ({
          ...frame,
          buttons: swapBits(frame.buttons, 2, 3),
        }))
      : recording;
  }

  onClear() {
    this.frames = [];
  }

  onFrame(frame: RealTimeHeldFrame) {
    this.frames.push(frame);
    console.log(this.frames);
  }

  onReorder(event: CdkDragDrop<RealTimeHeldFrame[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  onNeutral() {
    this.controller.setNeutral();
  }

  onPlay() {
    realtimePlayback(this.frames, 0)
      .pipe(
        tap((frame) => {
          this.controller.setButtons(
            frame.buttons,
            frame.leftTrigger,
            frame.rightTrigger
          );
        })
      )
      .subscribe({ complete: () => this.controller.setNeutral() });
  }
}
