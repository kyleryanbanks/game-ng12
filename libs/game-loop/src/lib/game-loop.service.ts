import { Injectable } from '@angular/core';
import { combineLatest, fromEvent, Observable, Observer, of } from 'rxjs';
import {
  distinctUntilChanged,
  expand,
  filter,
  map,
  share,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

export interface IFrameData {
  frameStartTime: number;
  deltaTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  connected$ = fromEvent<GamepadEvent>(window, 'gamepadconnected');
  disconnected$ = fromEvent<GamepadEvent>(window, 'gamepaddisconnected');

  calculateStep: (prevFrame?: IFrameData) => Observable<IFrameData> = (
    prevFrame?: IFrameData
  ) => {
    return Observable.create((observer: Observer<IFrameData>) => {
      requestAnimationFrame((frameStartTime) => {
        // Milliseconds to seconds
        const deltaTime = prevFrame
          ? (frameStartTime - prevFrame.frameStartTime) / 1000
          : 0;
        observer.next({
          frameStartTime,
          deltaTime,
        });
      });
    }).pipe(
      map((frame: IFrameData) => {
        if (frame.deltaTime > 1 / 60) {
          frame.deltaTime = 1 / 60;
        }
        return frame;
      })
    );
  };

  getFrames() {
    return of(undefined).pipe(
      expand((lastFrame?: IFrameData) => this.calculateStep(lastFrame)),
      // Expand emits the first value provided to it, and in this
      // case we just want to ignore the undefined input frame
      filter((lastFrame) => lastFrame !== undefined),
      tap((frame) => console.log(frame)),
      // map((lastFrame: IFrameData) => lastFrame.deltaTime),
      share()
    );
  }

  getButtonsPerFrames() {
    return this.connected$.pipe(
      tap(console.log),
      map((event) => event.gamepad.index),
      switchMap((id: number) => {
        return this.getFrames().pipe(
          map(() => {
            const pad = navigator.getGamepads()[id];
            return pad?.buttons.reduce<{ [index: string]: boolean }>(
              (buttons, button, index) => {
                buttons[index] = button.pressed;
                return buttons;
              },
              {}
            );
          }),
          distinctUntilChanged(),
          takeUntil(this.disconnected$)
        );
      })
    );
  }

  getMappedButtons() {
    return this.getButtonsPerFrames().pipe(
      map((buttons) => {
        return {
          TAG: buttons?.['2'] || false,
          LP: buttons?.['3'] || false,
          HP: buttons?.['5'] || false,
          STONE: buttons?.['4'] || false,
          LK: buttons?.['0'] || false,
          HK: buttons?.['7'] || false,
        };
      })
    );
  }

  getDirection(): Observable<number | null> {
    return this.getButtonsPerFrames().pipe(
      map((buttons) => {
        const UP = buttons?.['12'] || false;
        const DOWN = buttons?.['13'] || false;
        const LEFT = buttons?.['14'] || false;
        const RIGHT = buttons?.['15'] || false;

        if (UP && !RIGHT && !LEFT) {
          return 0;
        } else if (UP && RIGHT) {
          return 1;
        } else if (RIGHT && !UP && !DOWN) {
          return 2;
        } else if (DOWN && RIGHT) {
          return 3;
        } else if (DOWN && !RIGHT && !LEFT) {
          return 4;
        } else if (DOWN && LEFT) {
          return 5;
        } else if (LEFT && !UP && !DOWN) {
          return 6;
        } else if (UP && LEFT) {
          return 7;
        } else {
          return null;
        }
      })
    );
  }

  getInputs() {
    return combineLatest([this.getDirection(), this.getMappedButtons()]).pipe(
      distinctUntilChanged((prev, next) => {
        console.log(prev, next);
        return prev === next;
      })
      // scan((acc, [direction, buttons]) => [...acc, { direction, buttons }], [])
    );
  }
}
