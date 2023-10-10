import { Component, Input, OnInit } from '@angular/core';
import { Trend } from '../models/trend.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GetAllTrendProvidersResponse } from '../models/get-all-trend-providers-response';
import { TrendService } from '../trend.service';
import { createOneTrend, updateOneTrend } from '../store/actions/trend-detail-page.actions';
import { TrendProvider } from '../models/trend-provider.model';

@Component({
  selector: 'app-trend-edit',
  template: `
    <div class="trend-edit-backdrop" *ngIf="isActive"></div>
    <div class="trend-edit" *ngIf="isActive">
      <form class="trend-edit-form" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="trend-edit-form__header">
          <div class="trend-edit-form__header__title">
            <h4>{{ isEdit ? 'Edita la noticia' : 'Nueva noticia' }}</h4>
          </div>
          <div class="trend-edit-form__buttons">
            <button
              type="button"
              class="app-button app-button--secondary trend-edit-form__buttons__cancel"
              (click)="onCancel()"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="app-button app-button--primary trend-edit-form__buttons__submit"
            >
              Guardar
            </button>
          </div>
        </div>
        <div class="trend-edit-form__fields">
          <div class="trend-edit-form__fields__input">
            <label>URL</label>
            <input
              class="app-input"
              type="text"
              formControlName="url"
              [ngClass]="{
                'trend-edit-form__fields__input__error':
                  form.controls.url.errors?.['required']
                  && form.controls.url.touched
              }"
            />
            <div
              class="trend-edit-form__fields__error"
              *ngIf="form.controls.url.errors?.['required']
                && form.controls.url.touched"
            >
              Este campo es obligatorio
            </div>
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Imagen</label>
            <input
              class="app-input"
              type="text"
              formControlName="image"
              [ngClass]="{
                'trend-edit-form__fields__input__error':
                  form.controls.image.errors?.['required']
                  && form.controls.image.touched
              }"
            />
            <div
              class="trend-edit-form__fields__error"
              *ngIf="form.controls.image.errors?.['required']
                && form.controls.image.touched"
            >
              Este campo es obligatorio
            </div>
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Proveedor</label>
            <select
              class="app-input"
              formControlName="provider"
              [ngClass]="{
                'trend-edit-form__fields__input__error':
                  form.controls.provider.errors?.['required']
                  && form.controls.provider.touched
              }"
            >
              <option
                *ngFor="let provider of getAllTrendProvidersResponse"
                [value]="provider.value"
              >
                {{ provider.name }}
              </option>
            </select>
            <div
              class="trend-edit-form__fields__error"
              *ngIf="form.controls.provider.errors?.['required']
                && form.controls.provider.touched"
            >
              Este campo es obligatorio
            </div>
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Título</label>
            <input
              class="app-input"
              type="text"
              formControlName="title"
              [ngClass]="{
                'trend-edit-form__fields__input__error':
                  form.controls.title.errors?.['required']
                  && form.controls.title.touched
              }"
            />
            <div
              class="trend-edit-form__fields__error"
              *ngIf="form.controls.title.errors?.['required']
                && form.controls.title.touched"
            >
              Este campo es obligatorio
            </div>
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Contenido</label>
            <textarea
              class="app-input"
              type="textarea"
              formControlName="body"
              placeholder="Escribe aquí..."
              [ngClass]="{
                'trend-edit-form__fields__input__error':
                  form.controls.body.errors?.['required']
                  && form.controls.body.touched
              }"
            ></textarea>
            <div
              class="trend-edit-form__fields__error"
              *ngIf="form.controls.body.errors?.['required']
                && form.controls.body.touched"
            >
              Este campo es obligatorio
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./trend-edit.component.scss'],
})
export class TrendEditComponent implements OnInit {
  @Input() isEdit: boolean = false;

  @Input() isActive: boolean = false;

  getAllTrendProvidersResponse = GetAllTrendProvidersResponse;

  trend: Trend | null = null;

  public form = new FormGroup({
    url: new FormControl<string>('', [Validators.required]),
    image: new FormControl<string>('', [Validators.required]),
    provider: new FormControl<string>('', [Validators.required]),
    title: new FormControl<string>('', [Validators.required]),
    body: new FormControl<string>('', [Validators.required]),
  });

  constructor(private store: Store, private trendService: TrendService) {}

  ngOnInit(): void {}

  toggle(isEdit: boolean = false, trend: Trend | null = null) {
    this.isActive = !this.isActive;
    this.isEdit = isEdit;
    this.trend = trend;
    if (this.isEdit && trend) {
      this.form.get('url')?.setValue(trend.url);
      this.form.get('image')?.setValue(trend.image);
      this.form.get('provider')?.setValue(trend.provider);
      this.form.get('title')?.setValue(trend.title);
      this.form.get('body')?.setValue(trend.body.join('\n'));
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit && this.trend) {
      //Edit
      this.store
        .dispatch(
          updateOneTrend({
            trend: this.getTrendWithChanges(this.trend),
          })
        );
    } else {
      //Add
      this.store.dispatch(
        createOneTrend({
          trend: this.form.value as Partial<Trend>,
        })
      );
      this.onCancel();
    }
  }

  onCancel() {
    this.form.reset();
    this.isActive = false;
  }

  getTrendWithChanges(trend: Trend): Trend {
    const trendResult: Trend = {
      ...trend,
      url: this.form.get('url')?.value!,
      image: this.form.get('image')?.value!,
      provider:  this.form.get('provider')?.value! as TrendProvider,
      title: this.form.get('title')?.value!,
      body: [String(this.form.get('body')?.value!)],
    };
    return trendResult;
  }
}
