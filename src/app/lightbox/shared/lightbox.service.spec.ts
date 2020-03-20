import { LightboxService } from './lightbox.service';
import { LightboxData } from './lightbox.model';
import { LightboxComponent } from '../lightbox.component';
import resetAllMocks = jest.resetAllMocks;

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
     * First call to componentFactoryResolver resolves the lightbox component
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

    lightboxService.open({
      component: TestComponent,
      data: 'test'
    });
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

  it('should listen for close events of the lightbox', () => {
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
