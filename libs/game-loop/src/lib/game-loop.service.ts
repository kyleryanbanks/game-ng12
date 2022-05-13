import { Injectable } from '@angular/core';
import { combineLatest, fromEvent, Observable, Observer, of } from 'rxjs';
import {
  distinctUntilChanged,
  expand,
  filter,
  map,
  scan,
  share,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Frame, GamepadButtons, IFrameData } from './game-loop.models';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  connected$ = fromEvent<GamepadEvent>(window, 'gamepadconnected');
  disconnected$ = fromEvent<GamepadEvent>(window, 'gamepaddisconnected');

  calculateStep: (prevFrame?: IFrameData) => Observable<IFrameData> = (
    prevFrame?: IFrameData
  ) => {
    return new Observable((observer: Observer<IFrameData>) => {
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
      // tap((frame) => console.log(frame)),
      // map((lastFrame: IFrameData) => lastFrame.deltaTime),
      share()
    );
  }

  getButtonsPerFrames() {
    return this.connected$.pipe(
      // tap(console.log),
      map((event) => event.gamepad.index),
      switchMap((id: number) => {
        return this.getFrames().pipe(
          map(() => navigator.getGamepads()[id]),
          map((pad) => {
            return pad
              ? pad.buttons.reduce<GamepadButtons>((buttons, button, index) => {
                  buttons[index] = button.pressed;
                  return buttons;
                }, {})
              : {};
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

  getDirection(): Observable<number> {
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
          return 8;
        }
      })
    );
  }

  getInputs() {
    return this.getDirection().pipe(
      withLatestFrom(this.getMappedButtons()),
      distinctUntilChanged(
        ([prevDirection, prevButtons], [direction, buttons]) => {
          console.log({ prevDirection, prevButtons, direction, buttons });
          return (
            prevDirection === direction &&
            JSON.stringify(prevButtons) === JSON.stringify(buttons)
          );
        }
      ),
      scan(
        (acc: Frame[], [direction, buttons]) =>
          acc.length > 50
            ? [{ direction, buttons }]
            : [...acc, { direction, buttons }],
        []
      )
    );
  }
}
