import { Injectable } from '@angular/core';
import { fromEvent, Observable, Observer, of } from 'rxjs';
import { expand, filter, map, share, tap } from 'rxjs/operators';
import { IFrameData } from './game-loop.models';

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
      // map((lastFrame: IFrameData) => lastFrame.deltaTime),
      share()
    );
  }
}
