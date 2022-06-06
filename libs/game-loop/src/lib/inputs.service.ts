import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilKeyChanged,
  map,
  pairwise,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { GAMEPAD_TO_XUSB, HeldFrame } from './game-loop.models';

@Injectable({
  providedIn: 'root',
})
export class InputsService {
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
