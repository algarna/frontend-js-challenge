import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppTrendsRoutingModule } from './app-trends-routing.module';
import { AuthInterceptor } from './auth-interceptor';
import { TrendDetailComponent } from './trend-detail/trend-detail.component';
import { TrendService } from './trend.service';
import { TrendsListComponent } from './trends-list/trends-list.component';
import { trendsEffects } from './store/effects';
import { trendsFeatureKey, trendsReducer } from './store/reducers';
import { TrendAddComponent } from './trend-add/trend-add.component';

@NgModule({
  declarations: [TrendsListComponent, TrendDetailComponent, TrendAddComponent],
  imports: [
    CommonModule,
    AppTrendsRoutingModule,
    HttpClientModule,
    StoreModule.forFeature(trendsFeatureKey, trendsReducer),
    EffectsModule.forFeature(trendsEffects),
  ],
  exports: [TrendsListComponent],
  providers: [
    TrendService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppTrendsModule {}
