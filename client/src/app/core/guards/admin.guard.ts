import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AccountService} from '../services/account.service';
import {SnackbarService} from '../services/snackbar.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  if (!accountService.isAdmin()) {
    snackbarService.error('You do not have permission to access this area');
    router.navigateByUrl('/shop');
    return false;
  }
  return true;
};
