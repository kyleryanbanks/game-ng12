import { Injectable } from '@angular/core';
import { DS4Controller } from './controller.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ViGEmClient = (window as any).require('vigemclient');

@Injectable({ providedIn: 'root' })
export class ControllerService {
  client; // new ViGEmClient();
  connectionError: Error | null = null; // this.client.connect()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: DS4Controller; //this.client.createDS4Controller();

  constructor() {
    this.client = new ViGEmClient();
    this.connectionError = this.client.connect();
    this.controller = this.client.createDS4Controller();
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

  get directions() {
    return this.report.reportObj.wButtons & 0xf;
  }

  connect() {
    this.controller.connect();
  }

  disconnect() {
    this.controller.disconnect();
  }

  turtle() {
    this.controller.axis.dpadHorz.setValue(1);
    this.controller.axis.dpadVert.setValue(-1);
  }

  chill() {
    this.controller.axis.dpadHorz.setValue(0);
    this.controller.axis.dpadVert.setValue(0);
  }

  start() {
    this.controller.button.OPTIONS.setValue(true);
  }
}
