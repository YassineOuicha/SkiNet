import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextInputComponent} from '../../../shared/components/text-input/text-input.component';
import {MatButtonModule} from '@angular/material/button';
import {TextAreaComponent} from '../../../shared/components/text-area/text-area.component';
import {ShopService} from '../../../core/services/shop.service';
import {SelectInputComponent} from '../../../shared/components/select-input/select-input.component';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    MatButtonModule,
    MatDialogModule,
    TextAreaComponent,
    SelectInputComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductFormComponent>);
  shopService = inject(ShopService);


  ngOnInit(): void {
    this.initializeForm();
    setTimeout(() => {
      this.loadBrandsAndTypes();
    }, 1000)
  }

  private initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      pictureUrl: ['', [Validators.required]],
      type: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
    })
  }

  onSubmit() {
    if (this.productForm.valid) {
      let product = this.productForm.value;
      this.dialogRef.close({
        product
      });
    }
  }

  private loadBrandsAndTypes(): void {
    this.shopService.getBrands();
    this.shopService.getTypes();
  }
}
