import { NgModule } from '@angular/core';
import { FormControllerModule } from './form-controller/form-controller.module';

@NgModule({
  imports: [FormControllerModule],
  exports: [FormControllerModule],
})
export class UiModule {}
