import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectSelectedTrend } from '../store/selectors';
import { TrendEditComponent } from '../trend-edit/trend-edit.component';
import { TrendService } from '../trend.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trend-detail',
  template: `
    <a class="link-to-home" routerLink="/trends">
      <img src="assets/Iconos/Actions/back.svg" alt="Flecha hacia atrás" />
      <span>TODOS LOS EVENTOS</span>
    </a>
    <article class="trend__detail" *ngIf="trend$ | async as trend">
      <header class="trend__header">
        <div class="trend__actions">
          <button
            type="button"
            class="trend__action"
            (click)="toggleTrendForm(true)"
          >
            <img src="assets/Iconos/Actions/edit.svg" alt="Editar noticia" />
          </button>
          <button
            type="button"
            class="trend__action"
            (click)="deleteTrend(trend.id)"
          >
            <img src="assets/Iconos/Actions/delete.svg" alt="Borrar noticia" />
          </button>
        </div>
        <img class="trend__image" [src]="trend.image" alt="trend.title" />
      </header>
      <div class="trend__content">
        <h2 class="trend__title">
          <a class="trend__link" [href]="trend.url" target="_blank">
            {{ trend.title }}
          </a>
        </h2>
        <div class="trend_paragraph-container">
          <p class="trend__paragraph" *ngFor="let paragraph of trend.body">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </article>
    <app-trend-add (click)="toggleTrendForm()"></app-trend-add>
    <app-trend-edit
      #trendForm
      [isEdit]="isEdit"
      [isActive]="isFormActive"
    ></app-trend-edit>
  `,
  styleUrls: ['./trend-detail.component.scss'],
})
export class TrendDetailComponent implements OnDestroy {
  trend$ = this.store.select(selectSelectedTrend);
  trendSubscription$!: Subscription;

  isEdit: boolean = false;
  isFormActive: boolean = false;

  @ViewChild('trendForm') trendForm!: TrendEditComponent;

  constructor(
    private store: Store,
    private trendService: TrendService,
    private router: Router
  ) {}

  toggleTrendForm(isEdit: boolean = false) {
    this.isEdit = isEdit;

    if (this.isEdit) {
      this.trendSubscription$ = this.trend$.subscribe((trend) => {
        this.trendForm.toggle(isEdit, trend);
      });
    } else {
      this.trendForm.toggle(isEdit);
    }
  }

  deleteTrend(id: string) {
    if (confirm('¿Seguro que desea borrar esta noticia?')) {
      this.trendService
        .deleteOne(id)
        .subscribe(() => this.router.navigate(['trends']));
    }
  }

  ngOnDestroy(): void {
    if(this.trendSubscription$) {
      this.trendSubscription$.unsubscribe();
    }
  }
}
