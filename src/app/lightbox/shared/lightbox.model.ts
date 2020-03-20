import { Type } from '@angular/core';

export interface LightboxData<T = any> {
  data: T;
}

export interface LightboxOptions<T = any> {
  component: Type<LightboxData<T>>;
  data: T;
}
