import { Component } from '@angular/core';
import { GameLoopService } from '@game-ng12/game-loop';
import { Observable } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  order = [0, 1, 2, 3];
  connectedGamepads$: Observable<{ [id: string]: boolean }>;

  constructor(public gameLoop: GameLoopService) {
    this.connectedGamepads$ = this.gameLoop.connected$.pipe(
      scan(
        (gamepads, event) => {
          return {
            ...gamepads,
            [event.gamepad.index]: true,
          };
        },
        { 0: false, 1: false, 2: false, 3: false }
      ),
      startWith({ 0: false, 1: false, 2: false, 3: false })
    );
  }
}
