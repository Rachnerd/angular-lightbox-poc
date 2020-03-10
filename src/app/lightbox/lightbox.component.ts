import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { LightboxHostDirective } from './shared/lightbox-host.directive';

@Component({
  selector: 'poc-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit, OnDestroy {
  @ViewChild(LightboxHostDirective, { static: true })
  lightboxHost: LightboxHostDirective;

  @Output()
  closeEvent = new EventEmitter();

  ngOnInit() {}

  ngOnDestroy(): void {}

  preventClose(event) {
    event.stopPropagation();
    return false;
  }

  close() {
    this.closeEvent.emit();
  }
}
