import { Component, Input, OnInit } from '@angular/core';
import { Trend } from '../models/trend.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GetAllTrendProvidersResponse } from '../models/get-all-trend-providers-response';
import { TrendService } from '../trend.service';

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

  trendId: string | null = null;

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
    if (this.isEdit && trend) {
      this.trendId = trend.id;
      this.form.get('url')?.setValue(trend.url);
      this.form.get('image')?.setValue(trend.image);
      this.form.get('provider')?.setValue(trend.provider);
      this.form.get('title')?.setValue(trend.title);
      this.form.get('body')?.setValue(trend.body.join('\n'));
    } else {
      this.trendId = null;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit && this.trendId) {
      //Edit
      this.trendService
        .updateOne(this.getUpdatedChanges(), this.trendId)
        .subscribe((res) => {
          //TODO: Update store
          this.onCancel();
        });
    } else {
      //Add
      const formTrend = this.form.value as Partial<Trend>;
      this.trendService
        .createOne(this.form.value as Partial<Trend>)
        .subscribe((res) => {
          //TODO: Update store
          this.onCancel();
        });
    }
  }

  onCancel() {
    this.form.reset();
    this.isActive = false;
  }

  getUpdatedChanges() {
    let changedValues: Record<string, string> = {};
    Object.entries(this.form.controls).forEach((entry) => {
      let [key, control] = entry;
      if (control.dirty && key && control.value) {
        changedValues[key] = control.value;
      }
    });
    return changedValues;
  }
}
