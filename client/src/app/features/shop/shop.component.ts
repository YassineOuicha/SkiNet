import {Component, inject, OnInit} from '@angular/core';
import {ShopService} from '../../core/services/shop.service';
import {Product} from '../../shared/models/product';
import {ProductItemComponent} from './product-item/product-item.component';
import {MatDialog} from '@angular/material/dialog';
import {FiltersDialogComponent} from './filters-dialog/filters-dialog.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {ShopParams} from '../../shared/models/shopParams';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Pagination} from '../../shared/models/pagination';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatPaginator,
    FormsModule,
    MatIconButton,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService)
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;

  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'}
  ]
  pageSizeOptions = [5, 10, 20, 50];

  shopParams = new ShopParams();

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop(): void {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts(): void {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: err => console.log(err),
      complete: () => console.log('Request completed')
    });
  }

  openFiltersDialog(): void {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      width: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shopParams.brands = result.selectedBrands;
        this.shopParams.types = result.selectedTypes;
        this.shopParams.pageNumber = 1;
        this.getProducts();
      }
    });
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSearchChange() {
    // this.shopParams.search = searchTerm;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
}
