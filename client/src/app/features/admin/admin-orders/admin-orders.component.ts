import {Component, inject, OnInit} from '@angular/core';
import {CustomTableComponent} from '../../../shared/components/custom-table/custom-table.component';
import {Order} from '../../../shared/models/order';
import {OrderParams} from '../../../shared/models/orderParams';
import {DialogService} from '../../../core/services/dialog.service';
import {AdminService} from '../../../core/services/admin.service';
import {PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  imports: [
    CustomTableComponent
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  protected orders: Order[] = [];
  protected totalItems = 0;
  protected orderParams = new OrderParams();

  protected columns = [
    {field: 'id', header: 'No. '},
    {field: 'buyerEmail', header: 'Buyer Email'},
    {
      field: 'orderDate',
      header: 'Order Date',
      pipe: 'date',
      pipeArgs: {year: 'numeric', month: 'short', day: 'numeric'}
    },
    {field: 'total', header: 'Total', pipe: 'currency', pipeArgs: 'USD'},
    {field: 'status', header: 'Status'},
  ]

  actions = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View order',
      action: async (row: any) => {
        await this.router.navigateByUrl(`/orders/${row.id}`);
      }
    },
    {
      label: 'Refund',
      icon: 'undo',
      tooltip: 'Refund order',
      action: async (row: any) => {
        await this.openConfirmDialog(row.id);
      },
      disabled: (row: any) => row.status === 'Refunded'
    }
  ];

  ngOnInit() {
    this.loadOrders();
  }

  onAction(action: (row: any) => void, row: any) {
    action(row);
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund ?',
      'Are you sure you want to proceed refunding this order? This can not be undone.',
    )
    if (confirmed) {
      await this.refundOrder(id);
    }
  }

  protected onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  private loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.orders = response.data;
          this.totalItems = this.orders.length;
        }
      },
      error: err => {
        console.log("error while loading products", err);
      }
    });
  }

  private async refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        // we replace the order details with the updated details from api server
        this.orders = this.orders.map(o => o.id === id ? order : o);
        this.loadOrders(); // Update th UI to reflect changes
      },
      error: err => {
        console.log("error while refunding the product", err);
      }
    })
  }
}
