import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fam-shell',
  template: ` <router-outlet></router-outlet>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
