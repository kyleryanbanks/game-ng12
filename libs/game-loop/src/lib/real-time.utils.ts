import { Observable, Observer, of } from 'rxjs';
import { distinctUntilKeyChanged, expand } from 'rxjs/operators';
import { RealTimeData, RealTimeHeldFrame } from './game-loop.models';

export const realtimePlayback = (frames: RealTimeHeldFrame[], ms: number) =>
  new Observable((observer: Observer<RealTimeHeldFrame>) => {
    const context = new AudioContext();

    function checkTime(context: AudioContext, frameCount: number) {
      let nextFrameCount = frameCount;
      const frame = frames[frameCount];

      if (context.currentTime >= frame.time) {
        observer.next({
          ...frame,
        });
        nextFrameCount += 1;
      }

      if (frameCount > frames.length) {
        observer.complete();
      } else {
        setTimeout(() => {
          checkTime(context, nextFrameCount);
        }, ms);
      }
    }

    checkTime(context, 0);
  });

export const realTimeInterval: (ms: number) => Observable<RealTimeData> = (
  ms
) =>
  of({
    context: new AudioContext(),
    time: 0,
  }).pipe(
    expand((lastFrame) => {
      return new Observable((observer: Observer<RealTimeData>) => {
        setTimeout(() => {
          observer.next({
            ...lastFrame,
            time: lastFrame.context.currentTime,
          });
        }, ms);
      });
    }),
    distinctUntilKeyChanged('time')
  );
