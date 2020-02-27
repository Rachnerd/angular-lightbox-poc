import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LightboxOptions } from './lightbox.model';

@Injectable({
  providedIn: 'root'
})
export class LightboxService {
  private lightboxSubject: Subject<LightboxOptions>;
  lightbox$: Observable<LightboxOptions>;

  constructor() {
    this.lightboxSubject = new Subject<LightboxOptions>();
    this.lightbox$ = this.lightboxSubject.asObservable();
  }

  open<T>(component: LightboxOptions<T>) {
    this.lightboxSubject.next(component);
  }

  close() {
    this.lightboxSubject.next(undefined);
  }
}
