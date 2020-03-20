import { Component, OnDestroy, OnInit } from '@angular/core';
import { LightboxService } from './lightbox/shared/lightbox.service';
import { FullscreenImageComponent } from './fullscreen-image/fullscreen-image.component';
import { EmptyComponent } from './empty/empty.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'poc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  isLightboxOpen = false;

  constructor(private lightboxService: LightboxService) {}

  ngOnInit(): void {
    const openSub = this.lightboxService.open$.subscribe(
      _ => (this.isLightboxOpen = true)
    );

    this.subscriptions.add(openSub);

    const closeSub = this.lightboxService.close$.subscribe(
      _ => (this.isLightboxOpen = false)
    );

    this.subscriptions.add(closeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

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
