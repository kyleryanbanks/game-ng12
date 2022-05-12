import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControllerService, Term } from '@game-ng12/controller';
import { from, of, Subscription } from 'rxjs';
import { concatMap, delay, tap, timeInterval } from 'rxjs/operators';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit, OnDestroy {
  sequence: Term[] = [];
  subscriptions = new Subscription();
  connected = false;

  constructor(public controller: ControllerService) {}

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

  onClear() {
    this.sequence = [];
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

  onNeutral() {
    this.controller.setNeutral();
  }

  onPlay() {
    from(this.sequence)
      .pipe(
        concatMap((input) =>
          of(input).pipe(
            tap((frame) => this.controller.setButtons(frame.input)),
            delay(18 * input.hold)
          )
        ),
        tap(console.log),
        timeInterval(),
        tap(console.log)
      )
      .subscribe({ complete: () => this.controller.setNeutral() });
  }
}
