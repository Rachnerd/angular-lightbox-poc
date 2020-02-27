import { Component, OnInit } from '@angular/core';
import { LightboxComponent } from '../lightbox/shared/lightbox.model';

@Component({
  selector: 'poc-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit, LightboxComponent {
  data: void;

  constructor() {}

  ngOnInit() {}
}
