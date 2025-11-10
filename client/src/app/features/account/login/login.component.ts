import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AccountService} from '../../../core/services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder); // this a service
  private accountService = inject(AccountService);
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);
  returnUrl = '/shop';

  constructor() {
    const url = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }

  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe(); // setting user once logged in by subscribing
        this.router.navigateByUrl(this.returnUrl);
      }
    })
  }
}
