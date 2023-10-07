import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Trend } from '../models/trend.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-trend-edit',
  template: `
    <div class="trend-edit-backdrop" *ngIf="isActive"></div>
    <div class="trend-edit" *ngIf="isActive">
      <form class="trend-edit-form" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="trend-edit-form__header">
          <div class="trend-edit-form__header__title">
            <h4>{{ isEdit? "Edita la noticia" : "Nueva noticia" }}</h4>
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
            <input class="app-input" type="text" formControlName="url" />
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Autor</label>
            <input class="app-input" type="text" formControlName="author" />
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Título</label>
            <input class="app-input" type="text" formControlName="title" />
          </div>

          <div class="trend-edit-form__fields__input">
            <label>Contenido</label>
            <textarea
              class="app-input"
              type="textarea"
              formControlName="content"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./trend-edit.component.scss'],
})
export class TrendEditComponent implements OnInit {
  @Input() isEdit: boolean = false;

  @Input() trend: Trend | null = null;

  @Input() isActive: boolean = false;

  public form = new FormGroup({
    url: new FormControl<string>(''),
    author: new FormControl<string>(''),
    title: new FormControl<string>(''),
    content: new FormControl<string>(''),
  });

  constructor() {}

  ngOnInit(): void {}

  toggle() {
    this.isActive = !this.isActive;
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  onCancel() {
    this.form.reset();
    this.isActive = false;
  }
}
