import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route } from '@angular/router';
import { SequencerShellModule } from '@game-ng12/sequencer/shell';
import { UiModule } from '@game-ng12/ui';
import { ShellComponent } from './shell.component';

export const shellRoutes: Route[] = [{ path: '', component: ShellComponent }];

@NgModule({
  imports: [CommonModule, BrowserModule, UiModule, SequencerShellModule],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class ShellModule {}
