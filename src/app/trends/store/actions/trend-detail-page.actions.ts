import { createAction, props } from '@ngrx/store';

export const deleteOneTrend = createAction(
  '[Trend Detail Page] Delete One Trend',
  props<{ id: string }>()
);
