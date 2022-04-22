import { Component } from '@angular/core';
import { FamiliarService } from './familiar.service';

@Component({
  selector: 'fam-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  connected = false;
  pluggedIn = false;
  turtling = false;

  constructor(public familiar: FamiliarService) {}

  onConnect() {
    this.familiar.connect();
    this.connected = true;
  }

  onPlugIn() {
    this.familiar.plugInDS4Controller();
    this.pluggedIn = true;
  }

  onToggle() {
    this.turtling = !this.turtling;
    this.familiar.turtle();
  }
}
