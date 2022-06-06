import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { Frame, GAMEPAD_TO_XUSB, HeldFrame } from './game-loop.models';

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
              return pad.buttons.reduce<Frame>(
                (acc: Frame, button, index: number) => {
                  switch (index) {
                    case 6:
                      return { ...acc, leftTrigger: button.value };
                    case 7:
                      return { ...acc, rightTrigger: button.value };
                    default:
                      return {
                        ...acc,
                        ...(button.value
                          ? {
                              buttons: acc.buttons | GAMEPAD_TO_XUSB[index],
                            }
                          : {}),
                      };
                  }
                },
                { frame, buttons: 0, leftTrigger: 0, rightTrigger: 0 }
              );
            } else {
              return {
                frame,
                buttons: 0,
                leftTrigger: 0,
                rightTrigger: 0,
              };
            }
          })
        );
      })
    );
  }

  startRecordingControllerOnNextInput(controllerId: number) {
    this._stop = new Subject<void>();

    function isSameButtons(prev: Frame, next: Frame): boolean {
      return (
        prev.buttons === next.buttons &&
        prev.leftTrigger === next.leftTrigger &&
        prev.rightTrigger === next.rightTrigger
      );
    }

    return this.getButtonsPerFrame(controllerId).pipe(
      startWith<Frame>({
        frame: 0,
        buttons: 0,
        leftTrigger: 0,
        rightTrigger: 0,
      }),
      distinctUntilChanged(isSameButtons),
      pairwise(),
      map(([prev, next]) => ({ ...prev, hold: next.frame - prev.frame })),
      scan((acc: HeldFrame[], frame) => [...acc, frame], []),
      takeUntil(this._stop)
    );
  }
}
