import { FullscreenImageComponent } from './fullscreen-image.component';
import { LightboxService } from '../lightbox/shared/lightbox.service';

describe('FullscreenImageComponent', () => {
  let component: FullscreenImageComponent;
  const lightboxService: LightboxService = {
    close: jest.fn()
  } as any;

  const LANDSCAPE_DIMENSIONS = {
    height: 100,
    width: 200
  };

  const PORTRAIT_DIMENSIONS = {
    height: 200,
    width: 100
  };

  beforeEach(() => {
    component = new FullscreenImageComponent(lightboxService);
  });

  it('should close the lightbox', () => {
    component.close();
    expect(lightboxService.close).toHaveBeenCalledTimes(1);
  });

  describe('Loading the image', () => {
    it('should not be in a loaded state', () => {
      expect(component.loaded).toBeFalsy();
    });

    it('should be loaded after orientation is determined', () => {
      component.determineOrientation({
        target: LANDSCAPE_DIMENSIONS
      });
      expect(component.loaded).toBeTruthy();
    });

    it('should identify a landscape image', () => {
      component.determineOrientation({
        target: LANDSCAPE_DIMENSIONS
      });
      expect(component.isLandscape).toBeTruthy();
    });

    it('should identify a portrait image', () => {
      component.determineOrientation({
        target: PORTRAIT_DIMENSIONS
      });
      expect(component.isLandscape).toBeFalsy();
    });
  });
});
