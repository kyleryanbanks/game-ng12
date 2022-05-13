import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { InputViewerUiModule } from '@game-ng12/input-viewer/ui';
import { ShellComponent } from './shell.component';

export const routes: Route[] = [
  {
    path: '',
    component: ShellComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), InputViewerUiModule],
  declarations: [ShellComponent],
})
export class InputViewerShellModule {}
