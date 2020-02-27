import { Type } from '@angular/core';

export interface LightboxComponent<T = any> {
  data: T;
}

export interface LightboxOptions<T = any> {
  component: Type<LightboxComponent<T>>;
  data: T;
}
