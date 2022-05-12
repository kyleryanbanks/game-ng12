import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fam-shell',
  template: `<h1>Welcome to Familiar!</h1>
    <router-outlet></router-outlet>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: white;
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
export class ShellComponent {}
