import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { GameLoopService } from '@game-ng12/game-loop';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  order = [0, 1, 2, 3];
  connectedGamepads: { [id: string]: boolean } = {};

  constructor(public gameLoop: GameLoopService) {}

  ngOnInit() {
    this.subscription.add(
      this.gameLoop.connected$.subscribe((event) => {
        this.connectedGamepads[event.gamepad.id] = true;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
