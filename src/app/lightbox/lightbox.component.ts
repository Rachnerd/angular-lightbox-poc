import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { LightboxService } from './shared/lightbox.service';
import { Subscription } from 'rxjs';
import { LightboxHostDirective } from './shared/lightbox-host.directive';
import { LightboxOptions } from './shared/lightbox.model';

@Component({
  selector: 'poc-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @ViewChild(LightboxHostDirective, { static: true })
  lightboxHost: LightboxHostDirective;

  isOpen = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private lightboxService: LightboxService
  ) {}

  ngOnInit() {
    this.subscription = this.lightboxService.lightbox$.subscribe(options => {
      this.lightboxHost.viewContainerRef.clear();

      if (options === undefined) {
        this.isOpen = false;
        return;
      } else {
        this.loadComponent(options);
        this.isOpen = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close() {
    this.lightboxService.close();
  }

  preventClose(event) {
    event.stopPropagation();
    return false;
  }

  private loadComponent<T>(options: LightboxOptions<T>) {
    const { component, data } = options;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );

    const { instance } = this.lightboxHost.viewContainerRef.createComponent(
      componentFactory
    );
    instance.data = data;
  }
}
