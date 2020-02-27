import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LightboxModule } from './lightbox/lightbox.module';
import { FullscreenImageComponent } from './fullscreen-image/fullscreen-image.component';
import { EmptyComponent } from './empty/empty.component';

@NgModule({
  declarations: [AppComponent, EmptyComponent, FullscreenImageComponent],
  imports: [BrowserModule, LightboxModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EmptyComponent, FullscreenImageComponent]
})
export class AppModule {}
