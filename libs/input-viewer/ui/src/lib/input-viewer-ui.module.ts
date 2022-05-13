import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FrameButtonsComponent } from './frame-buttons/frame-buttons.component';
import { FrameDirectionComponent } from './frame-direction/frame-direction.component';
import { FrameViewComponent } from './frame-view/frame-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FrameButtonsComponent,
    FrameViewComponent,
    FrameDirectionComponent,
  ],
  exports: [FrameViewComponent],
})
export class InputViewerUiModule {}
