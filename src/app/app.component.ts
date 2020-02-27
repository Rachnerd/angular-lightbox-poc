import { Component } from '@angular/core';
import { LightboxService } from './lightbox/shared/lightbox.service';
import { FullscreenImageComponent } from './fullscreen-image/fullscreen-image.component';
import { EmptyComponent } from './empty/empty.component';

@Component({
  selector: 'poc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private lightboxService: LightboxService) {}

  openLightbox() {
    this.lightboxService.open({
      component: EmptyComponent,
      data: undefined
    });
  }

  openImage(image: string) {
    this.lightboxService.open({
      component: FullscreenImageComponent,
      data: { src: `assets/${image}` }
    });
  }
}
