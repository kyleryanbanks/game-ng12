import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@game-ng12/ui';
import { ShellComponent } from './shell.component';

@NgModule({
  imports: [CommonModule, DragDropModule, UiModule],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class SequencerShellModule {}
