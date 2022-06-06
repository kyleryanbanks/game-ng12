import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { InputViewerUiModule } from '@game-ng12/input-viewer/ui';
import { UiModule } from '@game-ng12/ui';
import { ShellComponent } from './shell.component';

export const routes: Route[] = [
  {
    path: '',
    component: ShellComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DragDropModule,
    UiModule,
    InputViewerUiModule,
    ReactiveFormsModule,
  ],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class SequencerShellModule {}
