import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[pocLightboxHost]'
})
export class LightboxHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
