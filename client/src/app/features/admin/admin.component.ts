import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Order} from '../../shared/models/order';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {AdminService} from '../../core/services/admin.service';
import {OrderParams} from '../../shared/models/orderParams';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {DialogService} from '../../core/services/dialog.service';

@Component({
  selector: 'app-admin',
  imports: [
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatPaginator,
    MatTableModule,
    DatePipe,
    CurrencyPipe,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'buyerEmail', 'total', 'orderDate', 'status', 'action'];
  dataSource = new MatTableDataSource<Order>([]);
  protected adminService = inject(AdminService);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];
  private router = inject(Router);
  private dialogService = inject(DialogService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        this.dataSource.data = response.data;
        this.totalItems = response.count;
      }
    });
  }

  onPageChanged(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelected(event: MatSelectChange) {
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

  protected onDisplayOrderDetails(id: number) {
    this.router.navigateByUrl('/orders/' + id);
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm Refund',
      'Are you sure you want to refund this order?' +
      ' This action cannot be undone.');

    if (confirmed) {
      this.onRefundOrder(id);
    }
  }

  protected onRefundOrder(id: number) {
    return this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.dataSource.data = this.dataSource.data.map(o => o.id == id ? order : o);
      }
    });
  }
}
