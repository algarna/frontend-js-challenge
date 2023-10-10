import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { routerNavigationAction } from '@ngrx/router-store';

import * as TrendsApiActions from '../actions/trends-api.actions';
import * as TrendsListPageActions from '../actions/trends-list-page.actions';
import * as TrendDetailPageActions from '../actions/trend-detail-page.actions';
import { TrendService } from '../../trend.service';
import { Router } from '@angular/router';

@Injectable()
export class TrendsEffects {
  loadTrends$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrendsListPageActions.loadTrends),
      mergeMap(() =>
        this.trendService.getAll().pipe(
          map((trends) => TrendsApiActions.loadTrendsSuccess({ trends })),
          catchError(() => of(TrendsApiActions.loadTrendsError()))
        )
      )
    );
  });

  loadOneTrend$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigationAction),
      filter(({ payload }) => /^\/trends\/[a-z0-9]+$/.test(payload.event.url)),
      map(({ payload }) => payload.routerState.root.firstChild?.params['id']),
      switchMap((id: string) =>
        this.trendService.getOne(id).pipe(
          map((trend) => TrendsApiActions.loadOneTrendSuccess({ trend })),
          catchError(() => of(TrendsApiActions.loadOneTrendError()))
        )
      )
    );
  });

  createOneTrend$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrendDetailPageActions.createOneTrend),
      mergeMap((data) =>
        this.trendService.createOne(data?.trend).pipe(
          map((trend) => TrendsApiActions.createOneTrendSuccess({ trend })),
          tap((trendAction) =>
            this.router.navigate(['trends', trendAction.trend.id])
          ),
          catchError(() => of(TrendsApiActions.createOneTrendError()))
        )
      )
    );
  });

  updateOneTrend$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrendDetailPageActions.updateOneTrend),
      switchMap((data) =>
        this.trendService.updateOne(data?.trend).pipe(
          map((trend) => TrendsApiActions.updateOneTrendSuccess({ trend })),
          tap((trendAction) =>
            this.router.navigate(['trends', trendAction.trend.id])
          ),
          catchError(() => of(TrendsApiActions.updateOneTrendError()))
        )
      )
    );
  });

  deleteOneTrend$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrendDetailPageActions.deleteOneTrend),
      switchMap(({ id }) =>
        this.trendService.deleteOne(id).pipe(
          map((success) =>
            success
              ? TrendsApiActions.deleteOneTrendSuccess({ id })
              : { type: 'NO ACTION' }
          ),
          tap(() => this.router.navigate([''])),
          catchError(() => of(TrendsApiActions.deleteOneTrendError()))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private trendService: TrendService,
    private router: Router
  ) {}
}
