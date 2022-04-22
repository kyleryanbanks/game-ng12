import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ViGEmClient = (window as any).require('vigemclient');

@Injectable({ providedIn: 'root' })
export class FamiliarService {
  client; // new ViGEmClient();
  connectionError: Error | null = null; // this.client.connect()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: any = undefined; //this.client.createDS4Controller();

  constructor() {
    this.client = new ViGEmClient();
  }

  connect(): Error | null {
    this.connectionError = this.client.connect();

    this.controller = this.client.createDS4Controller();

    return this.connectionError;
  }

  plugInDS4Controller() {
    return this.controller?.connect();
  }

  disconnect() {
    this.controller?.disconnect();
  }

  turtle() {
    this.controller?.axis.dpadHorz.setValue(1);
    this.controller?.axis.dpadVert.setValue(-1);
  }

  chill() {
    this.controller?.axis.dpadHorz.setValue(0);
    this.controller?.axis.dpadVert.setValue(0);
  }

  start() {
    this.controller?.button.OPTIONS.setValue(1);

    this.controller?.resetInputs();
  }
}
