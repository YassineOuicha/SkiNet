import {Component, Input, Self} from '@angular/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormControl, NgControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-text-area',
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatError
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
})
export class TextAreaComponent {
  @Input() label = '';

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  get control() {
    return this.controlDir.control as FormControl
  }
}
