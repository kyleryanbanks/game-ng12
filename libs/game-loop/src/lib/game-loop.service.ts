import { Injectable } from '@angular/core';
import { XUSB_BUTTON } from '@game-ng12/controller/shared';
import {
  BehaviorSubject,
  fromEvent,
  interval,
  Observable,
  Observer,
  of,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilKeyChanged,
  expand,
  filter,
  map,
  pairwise,
  scan,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Frame, GAMEPAD_TO_XUSB, IFrameData } from './game-loop.models';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  connected$ = fromEvent<GamepadEvent>(window, 'gamepadconnected');
  disconnected$ = fromEvent<GamepadEvent>(window, 'gamepaddisconnected');

  _msDelay = new BehaviorSubject<number>(16.6);
  set msDelay(msDelay: number) {
    this._msDelay.next(msDelay);
  }
  get msDelay() {
    return this._msDelay.getValue();
  }
  msDelay$ = this._msDelay.asObservable().pipe(debounceTime(200));

  _stop = new Subject<void>();
  stop() {
    this._stop.next();
    this._stop.complete();
  }

  calculateStep: (prevFrame?: IFrameData) => Observable<IFrameData> = (
    prevFrame?: IFrameData
  ) => {
    return new Observable((observer: Observer<IFrameData>) => {
      requestAnimationFrame((frameStartTime) => {
        // Milliseconds to seconds
        const deltaTime = prevFrame
          ? frameStartTime - prevFrame.frameStartTime
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

  getButtonsPerFrame(index: number = 0) {
    return this.msDelay$.pipe(
      switchMap((delay) => {
        return interval(delay).pipe(
          map((frame: number) => {
            const pad = navigator.getGamepads()[index];

            if (pad) {
              console.log({ gamepadButtons: pad.buttons });
              const buttons = pad.buttons.reduce<number>(
                (bitfield: number, button, index: number) =>
                  button.value ? bitfield | GAMEPAD_TO_XUSB[index] : bitfield,
                0
              );
              const cardinalDirection =
                this.deriveCardinalDirectionFromButtons(buttons);
              return {
                frame,
                buttons,
                cardinalDirection,
                now: performance.now(),
              };
            } else {
              return {
                frame,
                buttons: 0,
                cardinalDirection: 0,
                now: performance.now(),
              };
            }
          })
        );
      })
    );
  }

  deriveCardinalDirectionFromButtons = (buttons: number) => {
    const UP = buttons & XUSB_BUTTON.DPAD_UP;
    const DOWN = buttons & XUSB_BUTTON.DPAD_DOWN;
    const LEFT = buttons & XUSB_BUTTON.DPAD_LEFT;
    const RIGHT = buttons & XUSB_BUTTON.DPAD_RIGHT;

    if (UP && !RIGHT && !LEFT) {
      return 8;
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
      return 0;
    }
  };

  startRecordingOnNextInput() {
    this._stop = new Subject<void>();

    return this.getButtonsPerFrame().pipe(
      startWith({
        buttons: 0,
        frame: 0,
        cardinalDirection: 0,
      }),
      distinctUntilKeyChanged('buttons'),
      pairwise(),
      map(([prev, next]) => ({ ...prev, hold: next.frame - prev.frame })),
      scan((acc: Frame[], frame) => [...acc, frame], []),
      takeUntil(this._stop)
    );
  }
}
