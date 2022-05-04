import { Component } from '@angular/core';
import { ControllerService } from '@game-ng12/controller';
import { GameLoopService } from '@game-ng12/game-loop';
import { DS4_BUTTONS, DS4_DPAD_DIRECTIONS } from 'vigemclient/lib/common';

@Component({
  selector: 'fam-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  _DIR = DS4_DPAD_DIRECTIONS;
  _BTN = DS4_BUTTONS;
  connected = false;
  turtling = false;

  constructor(
    public controller: ControllerService,
    public gameLoop: GameLoopService
  ) {}

  onFrame(wButtons: number) {
    this.controller.setButtons(wButtons);
  }

  onDisconnect() {
    this.controller.disconnect();
    this.connected = false;
  }

  onConnect() {
    this.controller.connect();
    this.connected = true;
  }
}
