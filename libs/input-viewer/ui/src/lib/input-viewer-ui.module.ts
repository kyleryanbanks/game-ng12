import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FrameButtonsComponent } from './frame-buttons/frame-buttons.component';
import { FrameDirectionComponent } from './frame-direction/frame-direction.component';
import { FrameViewComponent } from './frame-view/frame-view.component';
import { XboxButtonsComponent } from './xbox-buttons/xbox-buttons.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    FrameButtonsComponent,
    FrameViewComponent,
    FrameDirectionComponent,
    XboxButtonsComponent,
  ],
  exports: [FrameViewComponent, XboxButtonsComponent],
})
export class InputViewerUiModule {}
