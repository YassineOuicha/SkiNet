import {Component, inject, OnInit, signal} from '@angular/core';
import {ShopService} from '../../core/services/shop.service';
import {ActivatedRoute} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatDivider} from '@angular/material/divider';
import {CartService} from '../../core/services/cart.service';
import {FormsModule} from '@angular/forms';
import {Product} from '../../shared/models/product';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, MatButton, MatIcon, MatFormField, MatLabel, MatInput, MatDivider, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  product = signal<Product | undefined>(undefined);
  quantityInCart = 0;
  quantity = 1;
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: product => {
        this.product.set(product);
        this.updateQuantityInCart();
      },
      error: error => console.log(error)
    });
  }

  updateQuantityInCart() {
    this.quantityInCart = this.cartService.cart()?.items
      .find(x => x.productId === this.product()?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText(): string {
    return this.quantityInCart === 0 ? 'Add to cart' : 'Update cart';
  }

  updateCart() {
    const product = this.product();
    if (!product) return;
    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(product.id, itemsToRemove);
    }
  }
}
