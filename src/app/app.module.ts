import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponentComponent } from './start-component/start-component.component';
import { SampleoneComponent } from './sampleone/sampleone.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponentComponent,
    SampleoneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
