import { Component, OnInit } from '@angular/core';
import { LightboxService } from '../lightbox/shared/lightbox.service';
import { LightboxData } from '../lightbox/shared/lightbox.model';
import { FullscreenImageData } from './shared/fullscreen-image.model';

@Component({
  selector: 'poc-fullscreen-image',
  templateUrl: './fullscreen-image.component.html',
  styleUrls: ['./fullscreen-image.component.scss']
})
export class FullscreenImageComponent
  implements OnInit, LightboxData<FullscreenImageData> {
  data: FullscreenImageData;
  loaded = false;
  isLandscape = true;

  constructor(private lightboxService: LightboxService) {}

  ngOnInit() {}

  close() {
      this.lightboxService.close();
  }

  determineOrientation({ target }) {
    this.isLandscape = target.height < target.width;
    this.loaded = true;
  }
}
