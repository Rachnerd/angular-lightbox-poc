import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { LightboxComponent } from '../lightbox.component';
import { LightboxOptions } from './lightbox.model';
import { filter } from 'rxjs/operators';

type LigthboxAction = 'close' | 'open';

interface LightboxEvent<T = any> {
  options: LightboxOptions<T>;
  action: LigthboxAction;
}

@Injectable({
  providedIn: 'root'
})
export class LightboxService {
  open$: Observable<LightboxEvent>;
  close$: Observable<LightboxEvent>;
  private events: Subject<LightboxEvent>;

  private lightboxRef: ComponentRef<LightboxComponent>;
  private closeSubscription: Subscription;

  private activeOptions: LightboxOptions;

  constructor(
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.events = new Subject();
    this.open$ = this.events.pipe(filter(({ action }) => action === 'open'));
    this.close$ = this.events.pipe(filter(({ action }) => action === 'close'));
  }

  /**
   * Open a component inside a Lightbox.
   */
  open<T>(options: LightboxOptions<T>) {
    if (this.activeOptions) {
      throw Error('Lightbox already active');
    }
    /**
     * Create a new Lightbox.
     */
    this.lightboxRef = this.createLightbox();

    /**
     * Add the desired component to the view of the Lightbox.
     */
    this.fillLightbox(this.lightboxRef, options);

    /**
     * Add the Lightbox to the application ref so change detection picks it up and life-cycle hooks are executed.
     */
    this.applicationRef.attachView(this.lightboxRef.hostView);

    /**
     * Get the root node of the LightBoxComponent.
     */
    const rootNode = (this.lightboxRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    /**
     * Append the Lightbox to the DOM.
     */
    document.body.appendChild(rootNode);

    this.activeOptions = options;

    this.events.next({
      options,
      action: 'open'
    });
  }

  close() {
    if (this.closeSubscription && !this.closeSubscription.closed) {
      /**
       * Stop listening to the close event.
       */
      this.closeSubscription.unsubscribe();
    }

    if (this.lightboxRef) {
      /**
       * Detach the component from change detection and life-cycle.
       */
      this.applicationRef.detachView(this.lightboxRef.hostView);
      this.lightboxRef = undefined;
    }

    if (this.activeOptions) {
      this.events.next({
        options: this.activeOptions,
        action: 'close'
      });

      this.activeOptions = undefined;
    }
  }

  private createLightbox(): ComponentRef<LightboxComponent> {
    /**
     * Create a Component factory.
     */
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LightboxComponent
    );

    /**
     * Create the Component manually (so not based on a viewContainerRef which has its own ref to
     * an injector).
     */
    const factory = componentFactory.create(this.injector);

    /**
     * Since we never use the component in the DOM we have to subscribe to the close event over here.
     * This also prevents circular dependencies because the Lightbox does not need to inject this service.
     */
    this.closeSubscription = factory.instance.closeEvent.subscribe(() =>
      this.close()
    );

    return factory;
  }

  /**
   * Bootstrap a component and add it to the Lightbox's LightboxHost directive.
   */
  private fillLightbox<T>(
    lightboxRef: ComponentRef<LightboxComponent>,
    { data, component }: LightboxOptions<T>
  ): void {
    /**
     * Create a Component factory.
     */
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );

    /**
     * Angular always puts dynamically resolved components BESIDE the content of the viewContainerRef.
     * If we would add the component directly to the viewContainerRef of the LightboxComponent it will
     * result in:
     *
     *  <div class="lightbox" (click)="close()">
     *    ...
     *  </div>
     *  <Component></Component> <---
     *
     * This can be fixed by using a directive (LightBoxHost). Now that the viewContainerRef of the
     * directive is used the HTML will result in:
     *
     *  <div class="lightbox" (click)="close()">
     *    ...
     *      <ng-template pocLightboxHost></ng-template>
     *      <Component></Component> <---
     *    ...
     *  </div>
     */
    const {
      instance,
      changeDetectorRef
    } = lightboxRef.instance.lightboxHost.viewContainerRef.createComponent(
      componentFactory
    );

    /**
     * Pass the data received by the LightboxOptions to the instance of the newly created component.
     */
    instance.data = data;

    /**
     * Call change detection to prevent "expression changed after it has been checked" error.
     */
    changeDetectorRef.detectChanges();
  }
}
