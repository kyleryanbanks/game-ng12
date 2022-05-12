import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControllerService } from '@game-ng12/controller';
import { GameLoopService } from '@game-ng12/game-loop';
import { DS4_BUTTONS, DS4_DPAD_DIRECTIONS } from 'vigemclient/lib/common';

@Component({
  selector: 'fam-shell',
  template: `<h1>Welcome to Familiar!</h1>

    <div class="controls">
      <button [disabled]="connected" (click)="onConnect()">Connect</button>
      <button [disabled]="!connected" (click)="onDisconnect()">
        Disconnect
      </button>
    </div>

    <seq-shell
      [connected]="connected"
      (frame)="onFrame($event)"
      (neutral)="controller.setNeutral()"
    ></seq-shell>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: white;
      }

      .controls {
        margin-bottom: 1rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }

      #header {
        height: 2rem;
        width: 100vw;
        background-color: red;
        -webkit-app-region: drag;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  _DIR = DS4_DPAD_DIRECTIONS;
  _BTN = DS4_BUTTONS;
  connected = false;

  constructor(
    public controller: ControllerService,
    public gameLoop: GameLoopService
  ) {}

  onFrame(wButtons: number) {
    this.controller.setButtons(wButtons);
  }

  onConnect() {
    this.controller.connect();
    this.connected = true;
  }

  onDisconnect() {
    this.controller.disconnect();
    this.connected = false;
  }
}
