import { Observable, Observer, of } from 'rxjs';
import { distinctUntilKeyChanged, expand, tap } from 'rxjs/operators';

export interface RealTimeData {
  context: AudioContext;
  time: number;
}

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
