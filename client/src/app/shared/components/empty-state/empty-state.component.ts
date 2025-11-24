import {Component, inject, input, output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {BusyService} from '../../../core/services/busy.service';

@Component({
  selector: 'app-empty-state',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  message = input.required<string>();
  icon = input.required<string>();
  actionText = input.required<string>();
  action = output<void>();

  busyService = inject(BusyService);

  onAction() {
    this.action.emit();
  }
}
