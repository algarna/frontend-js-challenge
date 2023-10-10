import { createAction, props } from '@ngrx/store';
import { Trend } from '../../models/trend.model';

export const createOneTrend = createAction(
  '[Trend Detail Page] Create One Trend',
  props<{ trend: Partial<Trend> }>()
);

export const updateOneTrend = createAction(
  '[Trend Detail Page] Update One Trend',
  props<{ trend: Trend }>()
);

export const deleteOneTrend = createAction(
  '[Trend Detail Page] Delete One Trend',
  props<{ id: string }>()
);
