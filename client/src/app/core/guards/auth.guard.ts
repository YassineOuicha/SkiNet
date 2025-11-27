import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AccountService} from '../services/account.service';
import {map, of} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  // we need to return an observable so we can wait the result to see if the user is authenticated
  if (accountService.currentUser()) {
    return of(true);
  } else {
    return accountService.getAuthState().pipe(
      map(auth => {
        if (auth.isAuthenticated) {
          return true;
        } else {
          router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});
          return false;
        }
      }),
    )
  }
};
