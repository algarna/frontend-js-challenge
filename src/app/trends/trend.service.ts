import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { GetAllTrendsResponse } from './models/get-all-trends-response.model';
import { GetOneTrendResponse } from './models/get-one-trend-response.model';
import { Trend } from './models/trend.model';
import { TrendProvider } from './models/trend-provider.model';
import { TrendResponse } from './models/trend-response.model';
import { environment } from 'src/environments/environment';
import { TrendDeleteResponse } from './models/trend-delete-response.model';
import { UpdateOneTrendResponse } from './models/update-one-trend-response.model';

@Injectable()
export class TrendService {
  private readonly urlBase = environment.avantioAPIHost;

  public readonly getAllUrl = `${this.urlBase}/v1/trends`;

  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<Trend[]> {
    return this.httpClient
      .get<GetAllTrendsResponse>(this.getAllUrl)
      .pipe(map(({ trends }) => [...trends.map(this.mapToTrendModel)]));
  }

  public getOne(id: string): Observable<Trend> {
    const url = `${this.getAllUrl}/${id}`;
    return this.httpClient
      .get<GetOneTrendResponse>(url)
      .pipe(map(({ trend }) => this.mapToTrendModel(trend)));
  }

  public createOne(trend: Partial<Trend>): Observable<Trend> {
    return this.httpClient
      .post<GetOneTrendResponse>(this.getAllUrl, trend)
      .pipe(map(({ trend }) => this.mapToTrendModel(trend)));
  }

  public updateOne(trend: Trend): Observable<Trend> {
    const url = `${this.getAllUrl}/${trend.id}`;
    return this.httpClient
      .put<UpdateOneTrendResponse>(url, this.mapToTrendRequest(trend))
      .pipe(map((response) => trend));
  }

  public deleteOne(id: string): Observable<boolean> {
    const url = `${this.getAllUrl}/${id}`;
    return this.httpClient
      .delete<TrendDeleteResponse>(url)
      .pipe(map((response) => response.success));
  }

  private mapToTrendModel(trendResponse: TrendResponse): Trend {
    return {
      id: trendResponse._id,
      body: trendResponse.body.split('\n\n'),
      createdAt: new Date(trendResponse.createdAt),
      image: trendResponse.image,
      provider: trendResponse.provider as TrendProvider,
      title: trendResponse.title,
      url: trendResponse.url,
    };
  }

  private mapToTrendRequest(trend: Trend): any {
    return {
      body: trend.body.join('\n'),
      image: trend.image,
      provider: trend.provider,
      title: trend.title,
      url: trend.url,
    };
  }
}
