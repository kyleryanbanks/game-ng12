import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  pairwise,
  scan,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  GAMEPAD_TO_XUSB,
  RealTimeFrame,
  RealTimeHeldFrame,
} from './game-loop.models';
import { realTimeInterval } from './real-time.utils';

@Injectable({
  providedIn: 'root',
})
export class RealTimeInputsService {
  _stop = new Subject<void>();

  getTimedButtons = (index: number = 0) =>
    realTimeInterval(0).pipe(
      map((frame) => {
        const pad = navigator.getGamepads()[index];

        if (pad) {
          return pad.buttons.reduce<RealTimeFrame>(
            (acc: RealTimeFrame, button, index: number) => {
              switch (index) {
                case 6:
                  return { ...acc, leftTrigger: button.value > 0.15 ? 1 : 0 };
                case 7:
                  return { ...acc, rightTrigger: button.value > 0.15 ? 1 : 0 };
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
            {
              time: frame.context.currentTime,
              buttons: 0,
              leftTrigger: 0,
              rightTrigger: 0,
            }
          );
        } else {
          return {
            time: frame.context.currentTime,
            buttons: 0,
            leftTrigger: 0,
            rightTrigger: 0,
          };
        }
      })
    );

  stopRecording = () => {
    this._stop.next();
    this._stop.complete();
  };

  startRecordingControllerOnNextInput = (controllerId: number) => {
    this._stop = new Subject<void>();

    function isSameButtons(prev: RealTimeFrame, next: RealTimeFrame): boolean {
      return (
        prev.buttons === next.buttons &&
        prev.leftTrigger === next.leftTrigger &&
        prev.rightTrigger === next.rightTrigger
      );
    }

    return this.getTimedButtons(controllerId).pipe(
      distinctUntilChanged(isSameButtons),
      pairwise(),
      map(([prev, next]) => ({ ...prev, hold: next.time - prev.time })),
      scan((acc: RealTimeHeldFrame[], frame) => [...acc, frame], []),
      takeUntil(this._stop)
    );
  };
}
