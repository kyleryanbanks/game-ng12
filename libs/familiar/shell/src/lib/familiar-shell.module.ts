import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ElectronGuard } from './electron.guard';
import { ShellComponent } from './shell.component';

export const routes: Route[] = [
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
      import('@game-ng12/sequencer/shell').then((m) => m.SequencerShellModule),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class FamiliarShellModule {}
