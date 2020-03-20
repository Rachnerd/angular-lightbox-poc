import { LightboxService } from './lightbox.service';
import { LightboxData, LightboxOptions } from './lightbox.model';
import { LightboxComponent } from '../lightbox.component';
import resetAllMocks = jest.resetAllMocks;
import { first } from 'rxjs/operators';

describe('LightboxService', () => {
  let lightboxService: LightboxService;

  const applicationRef = {
    attachView: jest.fn(),
    detachView: jest.fn()
  } as any;

  const componentFactoryResolver = {
    resolveComponentFactory: jest.fn()
  } as any;

  const injector = {} as any;

  /**
   * Rabobank doesn't use Testbed.
   */
  beforeEach(() => {
    lightboxService = new LightboxService(
      applicationRef,
      componentFactoryResolver,
      injector
    );
  });

  afterEach(() => {
    resetAllMocks();
  });

  class TestComponent implements LightboxData<string> {
    data: string;
  }

  let lightboxFactory;
  let lightboxFeatureFactoryResolver;
  let testComponentFactory;
  let testComponentFactoryResolver;

  const LIGHTBOX_OPTIONS: LightboxOptions<string> = {
    component: TestComponent,
    data: 'test'
  };

  beforeEach(() => {
    lightboxFactory = {
      instance: new LightboxComponent(),
      hostView: {
        rootNodes: ['html element']
      }
    };

    lightboxFeatureFactoryResolver = {
      create: jest.fn().mockReturnValue(lightboxFactory)
    };

    testComponentFactory = {
      instance: new TestComponent(),
      changeDetectorRef: {
        detectChanges: jest.fn()
      }
    };

    lightboxFactory.instance.lightboxHost = {
      viewContainerRef: {
        createComponent: jest.fn().mockReturnValue(testComponentFactory)
      }
    } as any;

    testComponentFactoryResolver = {
      create: jest.fn().mockReturnValue(testComponentFactory)
    };

    /**
     * First call to componentFactoryResolver resolves the Lightbox component
     */
    componentFactoryResolver.resolveComponentFactory.mockReturnValueOnce(
      lightboxFeatureFactoryResolver
    );

    /**
     * Second call to componentFactoryResolver resolves the test component
     */
    componentFactoryResolver.resolveComponentFactory.mockReturnValueOnce(
      testComponentFactoryResolver
    );

    spyOn(document.body, 'appendChild');
  });
  describe('Open Lightbox', () => {
    beforeEach(() => {
      lightboxService.open(LIGHTBOX_OPTIONS);
    });

    it('should create LightboxFeature', () => {
      expect(
        componentFactoryResolver.resolveComponentFactory
      ).toHaveBeenCalledWith(LightboxComponent);

      expect(lightboxFeatureFactoryResolver.create).toHaveBeenCalledWith(
        injector
      );
    });

    it('should attach LightboxFeature to the applicationRef', () => {
      expect(applicationRef.attachView).toHaveBeenCalledWith(
        lightboxFactory.hostView
      );
    });

    it('should listen for close events of the Lightbox', () => {
      spyOn(lightboxService, 'close');

      lightboxFactory.instance.close();

      expect(lightboxService.close).toHaveBeenCalledTimes(1);
    });

    it('should create TestComponent', () => {
      expect(
        componentFactoryResolver.resolveComponentFactory
      ).toHaveBeenCalledWith(TestComponent);
    });

    it('should add TestComponent to the LightboxHostDirective viewContainerRef', () => {
      expect(
        lightboxFactory.instance.lightboxHost.viewContainerRef.createComponent
      ).toHaveBeenCalledWith(testComponentFactoryResolver);
    });

    it('should set the data field of TestComponent', () => {
      expect(testComponentFactory.instance.data).toEqual('test');
      expect(
        testComponentFactory.changeDetectorRef.detectChanges
      ).toHaveBeenCalledTimes(1);
    });

    it('should add LightboxFeature to the LightboxHostDirective viewContainerRef', () => {
      expect(
        lightboxFactory.instance.lightboxHost.viewContainerRef.createComponent
      ).toHaveBeenCalledWith(testComponentFactoryResolver);
    });

    it('should only support 1 open Lightbox at the time', () => {
      expect(() => {
        lightboxService.open(LIGHTBOX_OPTIONS);
      }).toThrow();
    });
  });

  describe('Close Lightbox', () => {
    beforeEach(() => {
      lightboxService.open(LIGHTBOX_OPTIONS);
    });

    it('should unsubscribe from the close event after closing the Lightbox', () => {
      // tslint:disable-next-line
      spyOn(lightboxService['closeSubscription'], 'unsubscribe');

      lightboxService.close();

      expect(
        // tslint:disable-next-line
        lightboxService['closeSubscription'].unsubscribe
      ).toHaveBeenCalledTimes(1);
    });

    it('should detach LightboxFeature from the applicationRef after closing', () => {
      lightboxService.close();

      expect(applicationRef.detachView).toHaveBeenCalledWith(
        lightboxFactory.hostView
      );
    });

    it('should not fail if closed multiple times', () => {
      lightboxService.close();
      lightboxService.close();
    });
  });

  describe('Events', () => {
    it('should emit an event when a Lightbox is opened', () => {
      const spy = jest.fn();

      lightboxService.open$.pipe(first()).subscribe(spy);
      lightboxService.open(LIGHTBOX_OPTIONS);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        options: LIGHTBOX_OPTIONS,
        action: 'open'
      });
    });

    it('should emit an event when a Lightbox is closed', () => {
      const spy = jest.fn();

      lightboxService.open(LIGHTBOX_OPTIONS);

      lightboxService.close$.pipe(first()).subscribe(spy);

      lightboxService.close();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        options: LIGHTBOX_OPTIONS,
        action: 'close'
      });
    });

    it('should emit exactly 1 event when a Lightbox is closed', () => {
      const spy = jest.fn();

      lightboxService.open(LIGHTBOX_OPTIONS);

      const sub = lightboxService.close$.subscribe(spy);

      lightboxService.close();
      lightboxService.close();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        options: LIGHTBOX_OPTIONS,
        action: 'close'
      });

      sub.unsubscribe();
    });
  });
});
