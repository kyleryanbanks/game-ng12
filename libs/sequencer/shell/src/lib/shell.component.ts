import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Term } from '@game-ng12/controller';
import { from, of } from 'rxjs';
import { concatMap, delay, tap, timeInterval } from 'rxjs/operators';

@Component({
  selector: 'seq-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  sequence: Term[] = [];
  @Input() connected = false;
  @Output() frame = new EventEmitter<number>();
  @Output() neutral = new EventEmitter<null>();

  onClear() {
    this.sequence = [];
  }

  onNeutral() {
    this.neutral.emit();
  }

  onPlay() {
    from(this.sequence)
      .pipe(
        concatMap((input) =>
          of(input).pipe(
            delay(100 * input.hold),
            tap((frame) => this.frame.emit(frame.input))
          )
        ),
        tap(console.log),
        timeInterval(),
        tap(console.log)
      )
      .subscribe();
  }

  onFrame(term: Term) {
    this.sequence.push(term);
  }

  onReorder(event: CdkDragDrop<Term[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
