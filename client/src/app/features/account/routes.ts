import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {Route} from '@angular/router';

export const accountRoutes: Route[] = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
]
