import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fam-shell',
  template: `<h1>Welcome to Familiar!</h1>
    <a routerLink="sequencer">Sequencer</a>
    <a routerLink="">Input Viewer</a>
    <router-outlet></router-outlet>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      a {
        color: white;
        font-size: 20px;
        margin-bottom: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
