import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.css'
})
export class RangeSliderComponent {
  private _value1!: number;
  private _value2!: number;

  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
  @Input() get value1(): number { return this._value1; }
  @Input() get value2(): number { return this._value2; }
  @Output() value1Change = new EventEmitter<number>();
  @Output() value2Change = new EventEmitter<number>();

  trackLeft: string = '';
  trackWidth: string = '';

  set value1(val: number) {
    this._value1 = val;
    this.value1Change.emit(this._value1);
    this.onValueChange();
  }

  set value2(val: number) {
    this._value2 = val;
    this.value2Change.emit(this._value2);
    this.onValueChange();
  }

  constructor() {}

  ngOnInit(): void {
    if (this.value1 === undefined) this.value1 = this.min;
    if (this.value2 === undefined) this.value2 = this.max;
  }

  onValueChange() {
    if (this._value1 > this._value2) {
      [this._value1, this._value2] = [this._value2, this._value1];
    }
    this.value1Change.emit(this._value1);
    this.value2Change.emit(this._value2);
    this.updateTrackStyles();
  }

  updateTrackStyles() {
    const left = ((this._value1 - this.min) / (this.max - this.min)) * 100;
    const right = ((this._value2 - this.min) / (this.max - this.min)) * 100;
    this.trackLeft = `calc(${left}% + 2px)`;
    this.trackWidth = `calc(${right - left}% - 4px)`;
  }
}
