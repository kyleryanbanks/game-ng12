import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { SequencerShellModule } from '@game-ng12/sequencer/shell';
import { UiModule } from '@game-ng12/ui';
import { ElectronGuard } from './electron.guard';
import { ShellComponent } from './shell.component';

export const routes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@game-ng12/input-viewer/shell').then(
            (m) => m.InputViewerShellModule
          ),
      },
      {
        path: 'sequencer',
        canLoad: [ElectronGuard],
        loadChildren: () =>
          import('@game-ng12/sequencer/shell').then(
            (m) => m.SequencerShellModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    UiModule,
    SequencerShellModule,
  ],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class ShellModule {}
