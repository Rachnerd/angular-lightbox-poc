import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  ViewRef
} from '@angular/core';
import { LightboxOptions } from './lightbox.model';
import { LightboxComponent } from '../lightbox.component';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightboxService {
  private hostView: ViewRef;
  private domElement: HTMLElement;
  private closeSubscription: Subscription;

  constructor(
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  open<T>(options: LightboxOptions<T>) {
    this.close();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LightboxComponent
    );

    const { instance, hostView } = componentFactory.create(this.injector);
    instance.options = options;

    this.closeSubscription = instance.closeEvent
      .pipe(first())
      .subscribe(() => this.close());

    this.hostView = hostView;

    this.applicationRef.attachView(this.hostView);

    this.domElement = (this.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(this.domElement);
  }

  close() {
    if (this.domElement) {
      document.body.removeChild(this.domElement);
      this.domElement = undefined;
    }

    if (this.hostView) {
      this.applicationRef.detachView(this.hostView);
      this.hostView = undefined;
    }

    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
