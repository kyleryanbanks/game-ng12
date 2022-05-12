import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FamiliarShellModule } from '@game-ng12/familiar-shell';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FamiliarShellModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
