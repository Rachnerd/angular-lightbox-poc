import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { EmptyComponent } from './empty/empty.component';
import { FullscreenImageComponent } from './fullscreen-image/fullscreen-image.component';
import { Subject } from 'rxjs';
import { LightboxEvent } from './lightbox/shared/lightbox.model';

describe('AppComponent', () => {
  let component: AppComponent;

  const lightboxService = {
    open: jest.fn(),
    close: jest.fn(),
    open$: new Subject<LightboxEvent>(),
    close$: new Subject<LightboxEvent>()
  };

  const LIGHTBOX_CLOSE_EVENT: LightboxEvent = {
    options: {} as any,
    action: 'close'
  };
  const LIGHTBOX_OPEN_EVENT: LightboxEvent = {
    options: {} as any,
    action: 'close'
  };

  beforeEach(() => {
    component = new AppComponent(lightboxService as any);
    component.ngOnInit();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Opening components', () => {
    it('should open an Empty component in a Lightbox', () => {
      component.openLightbox();
      expect(lightboxService.open).toHaveBeenCalledTimes(1);
      expect(lightboxService.open).toHaveBeenCalledWith({
        component: EmptyComponent,
        data: undefined
      });
    });

    it('should open an FullscreenImage component in a Lightbox', () => {
      component.openImage('url');
      expect(lightboxService.open).toHaveBeenCalledTimes(1);
      expect(lightboxService.open).toHaveBeenCalledWith({
        component: FullscreenImageComponent,
        data: {
          src: `assets/url`
        }
      });
    });
  });

  describe('Handling events', () => {
    it('should detect an open Lightbox', () => {
      lightboxService.open$.next(LIGHTBOX_OPEN_EVENT);

      expect(component.isLightboxOpen).toBeTruthy();
    });

    it('should detect a closed Lightbox', () => {
      lightboxService.open$.next(LIGHTBOX_OPEN_EVENT);

      lightboxService.close$.next(LIGHTBOX_CLOSE_EVENT);

      expect(component.isLightboxOpen).toBeFalsy();
    });

    it('should stop listening after destroyed', () => {
      component.ngOnDestroy();

      lightboxService.open$.next(LIGHTBOX_OPEN_EVENT);

      expect(component.isLightboxOpen).toBeFalsy();
    });
  });
});
