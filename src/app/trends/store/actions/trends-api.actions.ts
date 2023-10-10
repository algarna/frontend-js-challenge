import { createAction, props } from '@ngrx/store';

import { Trend } from '../../models/trend.model';

export const loadTrendsSuccess = createAction(
  '[Trends/API] Load Trends Success',
  props<{ trends: Trend[] }>()
);

export const loadTrendsError = createAction('[Trends/API] Load Trends Error');

export const loadOneTrendSuccess = createAction(
  '[Trends/API] Load One Trend Success',
  props<{ trend: Trend }>()
);

export const loadOneTrendError = createAction(
  '[Trends/API] Load One Trend Error'
);

export const createOneTrendSuccess = createAction(
  '[Trends/API] Create One Trend Success',
  props<{ trend: Trend }>()
);

export const createOneTrendError = createAction(
  '[Trends/API] Create One Trend Error'
);

export const updateOneTrendSuccess = createAction(
  '[Trends/API] Update One Trend Success',
  props<{ trend: Trend }>()
);

export const updateOneTrendError = createAction(
  '[Trends/API] Update One Trend Error'
);

export const deleteOneTrendSuccess = createAction(
  '[Trends/API] Delete One Trend Success',
  props<{ id: string }>()
);

export const deleteOneTrendError = createAction(
  '[Trends/API] Delete One Trend Error'
);
