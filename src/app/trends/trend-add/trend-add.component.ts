import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trend-add',
  template: `
    <button class="app-button app-button--primary app-button--fixed">
      <img src="assets/Iconos/Actions/add.svg" alt="Nueva noticia" />
    </button>
  `,
  styleUrls: ['./trend-add.component.scss'],
})
export class TrendAddComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

}
