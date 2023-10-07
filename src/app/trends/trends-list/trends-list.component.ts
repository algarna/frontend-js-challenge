import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { loadTrends } from '../store/actions/trends-list-page.actions';
import { selectTrendsByProvider } from '../store/selectors';
import { TrendEditComponent } from '../trend-edit/trend-edit.component';

@Component({
  selector: 'app-trends-list',
  template: `
    <article class="trend" *ngFor="let trend of trends$ | async">
      <a class="trend__link" routerLink="/trends/{{ trend.id }}">
        <figure class="trend__figure">
          <img class="trend__image" [src]="trend.image" [alt]="trend.title" />
          <figcaption class="trend__title">
            <h2>{{ trend.title }}</h2>
          </figcaption>
        </figure>
        <p class="trend__excerpt">{{ trend.body[0] }}</p>
      </a>
    </article>
    <app-trend-add (click)="toggleTrendForm()"></app-trend-add>
    <app-trend-edit
      #trendForm
      [isActive]="isFormActive"
    ></app-trend-edit>
  `,
  styleUrls: ['./trends-list.component.scss'],
})
export class TrendsListComponent implements OnInit {
  protected trends$ = this.store.select(selectTrendsByProvider);

  isFormActive: boolean = false;

  @ViewChild('trendForm') trendForm!: TrendEditComponent;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadTrends());
  }

  toggleTrendForm() {
    this.trendForm.toggle();
  }
}
