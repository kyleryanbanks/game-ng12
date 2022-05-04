import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControllerComponent } from './form-controller.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [FormControllerComponent],
  exports: [FormControllerComponent],
})
export class FormControllerModule {}
