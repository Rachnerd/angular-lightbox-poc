import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { LightboxHostDirective } from './shared/lightbox-host.directive';

@NgModule({
  declarations: [LightboxComponent, LightboxHostDirective],
  imports: [
    CommonModule
  ],
  exports: [],
  entryComponents: [LightboxComponent]
})
export class LightboxModule { }
