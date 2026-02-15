import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-custom-table',
  imports: [
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatPaginator
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent {
  @Input() columns: { field: string, header: string, pipe?: string, pipeArgs?: any }[] = [];
  @Input() dataSource: any[] = [];
  @Input() actions: {
    label: string,
    icon: string,
    tooltip: string,
    action: (row: any) => void,
    disabled?: (row: any) => boolean
  }[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 5;
  @Input() pageIndex: number = 0;

  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pageChange.emit(event);
  }

  onAction(action: (row: any) => void, row: any) {
    action(row);
  }

  getCellValue(row: any, column: any) {
    const value = row[column.field];
    if (column.pipe === 'currency') {
      return new Intl.NumberFormat('en-US', {style: 'currency', currency: column.pipeArgs || 'USD'}).format(value);
    }
    if (column.pipe === 'date') {
      return new Date(value).toLocaleDateString('en-US', column.pipeArgs);
    }

    return value;
  }
}
