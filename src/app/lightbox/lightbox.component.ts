import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { LightboxHostDirective } from './shared/lightbox-host.directive';
import { LightboxOptions } from './shared/lightbox.model';

@Component({
  selector: 'poc-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit, OnDestroy {
  @ViewChild(LightboxHostDirective, { static: true })
  lightboxHost: LightboxHostDirective;

  @Output()
  closeEvent = new EventEmitter();

  options: LightboxOptions;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const { component, data } = this.options;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );

    const { instance } = this.lightboxHost.viewContainerRef.createComponent(
      componentFactory
    );
    instance.data = data;
  }

  ngOnDestroy(): void {}

  preventClose(event) {
    event.stopPropagation();
    return false;
  }

  close() {
    this.closeEvent.emit();
  }
}
