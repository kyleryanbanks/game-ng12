import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SequencerShellModule } from '@game-ng12/sequencer/shell';
import { UiModule } from '@game-ng12/ui';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UiModule, SequencerShellModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
