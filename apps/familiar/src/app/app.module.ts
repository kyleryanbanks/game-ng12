import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShellModule } from '@game-ng12/shell';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ShellModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
