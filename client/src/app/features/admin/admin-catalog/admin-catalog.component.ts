import {Component, inject, OnInit} from '@angular/core';
import {Product} from '../../../shared/models/product';
import {ShopService} from '../../../core/services/shop.service';
import {ShopParams} from '../../../shared/models/shopParams';
import {PageEvent} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';
import {CustomTableComponent} from '../../../shared/components/custom-table/custom-table.component';
import {MatDialog} from '@angular/material/dialog';
import {ProductFormComponent} from '../product-form/product-form.component';

@Component({
  selector: 'app-admin-catalog',
  imports: [
    MatButton,
    CustomTableComponent
  ],
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.scss',
})
export class AdminCatalogComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialog = inject(MatDialog);
  products: Product[] = [];
  productParams = new ShopParams();
  totalItems = 0;

  columns = [
    {field: 'id', header: 'No.'},
    {field: 'name', header: 'Product name'},
    {field: 'price', header: 'Price', pipe: 'currency', pipeArgs: 'USD'},
    {field: 'quantityInStock', header: 'Quantity'},
    {field: 'type', header: 'Type'},
    {field: 'brand', header: 'Brand'},
  ]

  actions = [
    {
      label: 'Edit',
      icon: 'edit',
      tooltip: 'Edit product',
      action: (row: any) => {
        console.log(row);
      }
    },
    {
      label: 'Delete',
      icon: 'delete',
      tooltip: 'Delete product',
      action: (row: any) => {
        console.log(row);
      }
    },
    {
      label: 'Update quantity',
      icon: 'add_circle',
      tooltip: 'Update quantity in stock',
      action: (row: any) => {
        console.log(row);
      }
    }
  ]

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    this.shopService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.products = response.data;
          this.totalItems = response.count;
        }
      },
      error: error => {
        console.log('Error loading products', error);
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }

  openCreateDialog() {
    const dialog = this.dialog.open(ProductFormComponent, {
      minWidth: '500px',
      data: {
        title: 'Create product'
      }
    });

    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          console.log(result);
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }
}
