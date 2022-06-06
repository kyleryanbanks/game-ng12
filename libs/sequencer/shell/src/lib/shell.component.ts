import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControllerService } from '@game-ng12/controller/data';
import { swapBits } from '@game-ng12/controller/shared';
import { HeldFrame } from '@game-ng12/game-loop';
import { RecordingsStore } from '@game-ng12/recorder/data';
import { from, of, Subscription } from 'rxjs';
import { concatMap, delay, tap, timeInterval } from 'rxjs/operators';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit, OnDestroy {
  frames: HeldFrame[] = [];
  subscriptions = new Subscription();
  connected = false;

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
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onLoad(id: string) {
    this.frames = this.recordings.getFramesForSelectedRecording(id) || [];
  }

  onClear() {
    this.frames = [];
  }

  onFrame(frame: HeldFrame) {
    this.frames.push(frame);
  }

  onReorder(event: CdkDragDrop<HeldFrame[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  onNeutral() {
    this.controller.setNeutral();
  }

  onPlay(asP2: boolean) {
    let frames = this.frames;

    if (asP2) {
      frames = frames.map((frame) => ({
        ...frame,
        buttons: swapBits(frame.buttons, 2, 3),
      }));
    }

    from(frames)
      .pipe(
        concatMap((frame) =>
          of(frame).pipe(
            tap((frame) =>
              this.controller.setButtons(
                frame.buttons,
                frame.leftTrigger,
                frame.rightTrigger
              )
            ),
            delay(18 * frame.hold)
          )
        ),
        tap(console.log),
        timeInterval(),
        tap(console.log)
      )
      .subscribe({ complete: () => this.controller.setNeutral() });
  }
}
