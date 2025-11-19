import {Component, inject, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {SignalrService} from '../../../core/services/signalr.service';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {PaymentCardPipe} from '../../../shared/pipes/payment-card.pipe';
import {AddressPipe} from '../../../shared/pipes/address.pipe';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {OrderService} from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout-success',
  imports: [
    RouterLink,
    MatButton,
    DatePipe,
    PaymentCardPipe,
    AddressPipe,
    CurrencyPipe,
    MatProgressSpinner
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnDestroy {
  signalrService = inject(SignalrService);
  private orderService = inject(OrderService);

  ngOnDestroy() {
    this.orderService.orderComplete = false;
    this.signalrService.orderSignal.set(null);
  }
}
