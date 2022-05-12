import { NgModule } from '@angular/core';
import { ShellModule } from '@game-ng12/shell';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [ShellModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
