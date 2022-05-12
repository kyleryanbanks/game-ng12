import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ShellComponent } from './shell.component';

export const shellRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    ShellComponent
  ],
  exports: [
    ShellComponent
  ],
})
export class ShellModule {}
