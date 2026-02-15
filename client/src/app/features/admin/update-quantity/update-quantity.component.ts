import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-update-quantity',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    FormsModule,
    MatButtonModule],
  templateUrl: './update-quantity.component.html',
  styleUrl: './update-quantity.component.scss',
})
export class UpdateQuantityComponent {
  data = inject(MAT_DIALOG_DATA);
  updatedQuantity = this.data.quantity;
  private dialogRef = inject(MatDialogRef<UpdateQuantityComponent>);

  updateQuantity(): void {
    if (this.updatedQuantity > 0) {
      this.dialogRef.close({
        updatedQuantity: this.updatedQuantity,
      });
    }
  }
}
