import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { from, of } from 'rxjs';
import { concatMap, delay, tap, timeInterval } from 'rxjs/operators';

@Component({
  selector: 'seq-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  frames: number[] = [];
  @Output() frame = new EventEmitter<number>();

  onPlay() {
    from(this.frames)
      .pipe(
        concatMap((i) =>
          of(i).pipe(
            delay(500), // slow for demo purposes
            tap((frame) => this.frame.emit(frame))
          )
        ),
        tap(console.log),
        timeInterval(),
        tap(console.log)
      )
      .subscribe();
  }

  onFrame(frame: number) {
    this.frames.push(frame);
  }

  onReorder(event: CdkDragDrop<number[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
