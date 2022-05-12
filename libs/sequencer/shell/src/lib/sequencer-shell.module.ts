import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
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
  ],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class SequencerShellModule {}
