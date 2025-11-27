import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from '../../../core/services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../../shared/models/order';
import {MatCardModule} from '@angular/material/card';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {AddressPipe} from '../../../shared/pipes/address.pipe';
import {PaymentCardPipe} from '../../../shared/pipes/payment-card.pipe';
import {MatButton} from '@angular/material/button';
import {AccountService} from '../../../core/services/account.service';
import {AdminService} from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe,
    MatButton
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private adminService = inject(AdminService);
  private router = inject(Router);
  order?: Order;
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders';

  ngOnInit() {
    this.loadOrder();
  }

  onReturnClick() {
    this.accountService.isAdmin()
      ? this.router.navigateByUrl('/admin')
      : this.router.navigateByUrl('/orders');
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.params['id']; // paramMap.get('id')
    if (!id) {
      return;
    }
    const loadOrderData = this.accountService.isAdmin()
      ? this.adminService.getOrderDetails(id)
      : this.orderService.getOrderDetailed(id);
    loadOrderData.subscribe({
      next: order => this.order = order,
    })
  }
}
