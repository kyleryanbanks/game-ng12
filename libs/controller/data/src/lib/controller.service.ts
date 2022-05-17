import { Injectable } from '@angular/core';
import {
  DS4Controller,
  DS4_BUTTONS,
  DS4_DPAD_DIRECTIONS,
  DS4_SPECIAL_BUTTONS,
} from '@game-ng12/controller/shared';
import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViGEmClient = (window as any).require('vigemclient');

@Injectable({ providedIn: 'root' })
export class ControllerService {
  client; // new ViGEmClient();
  connectionError: Error | null = null; // this.client.connect()
  controller: DS4Controller; //this.client.createDS4Controller();

  _connected = new BehaviorSubject(false);

  constructor() {
    this.client = new ViGEmClient();
    this.connectionError = this.client.connect();
    this.controller = this.client.createDS4Controller();
  }

  connect() {
    this.controller.connect();
    this._connected.next(true);
  }

  disconnect() {
    this.controller.disconnect();
    this._connected.next(false);
  }

  get connected() {
    return this._connected.asObservable();
  }

  get report() {
    return this.controller._report;
  }

  get inputs() {
    return this.report.reportObj.wButtons;
  }

  get buttons() {
    return this.report.reportObj.wButtons >> 4;
  }

  get direction() {
    return this.report.reportObj.wButtons & 0xf;
  }

  setButtons(wButtons: number) {
    this.controller._report.reportObj.wButtons = wButtons;
    this.controller.update();
  }

  setNeutral() {
    this.controller.resetInputs();
  }

  setSpecial(buttonIndex: DS4_SPECIAL_BUTTONS, value: boolean) {
    if (value) {
      this.controller._report.reportObj.bSpecial |= buttonIndex;
    } else {
      this.controller._report.reportObj.bSpecial &= ~buttonIndex;
    }
    this.controller.update();
  }

  setButton(buttonIndex: DS4_BUTTONS, value: boolean) {
    if (value) {
      this.controller._report.reportObj.wButtons |= buttonIndex;
    } else {
      this.controller._report.reportObj.wButtons &= ~buttonIndex;
    }
    this.controller.update();
  }

  setDirection(directionValue: DS4_DPAD_DIRECTIONS) {
    this.controller._report.reportObj.wButtons &= 0xfff0; // reset dpad
    this.controller._report.reportObj.wButtons |= directionValue;
    this.controller.update();
  }
}
