import { Injectable } from '@angular/core';
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
import { GAMEPAD_TO_XUSB, HeldFrame, IFrameData } from './game-loop.models';

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
              const buttons = pad.buttons.reduce<number>(
                (bitfield: number, button, index: number) =>
                  button.value ? bitfield | GAMEPAD_TO_XUSB[index] : bitfield,
                0
              );
              return {
                frame,
                buttons,
                now: performance.now(),
              };
            } else {
              return {
                frame,
                buttons: 0,
                now: performance.now(),
              };
            }
          })
        );
      })
    );
  }

  startRecordingControllerOnNextInput(controllerId: number) {
    this._stop = new Subject<void>();

    return this.getButtonsPerFrame(controllerId).pipe(
      startWith({
        buttons: 0,
        frame: 0,
        cardinalDirection: 0,
      }),
      distinctUntilKeyChanged('buttons'),
      pairwise(),
      map(([prev, next]) => ({ ...prev, hold: next.frame - prev.frame })),
      scan((acc: HeldFrame[], frame) => [...acc, frame], []),
      takeUntil(this._stop)
    );
  }
}
