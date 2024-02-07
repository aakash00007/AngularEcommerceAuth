import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { adminGuardGuard } from './guards/admin-guard.guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SignupComponent},
  {path:"dashboard",component:DashboardComponent,canActivate:[authGuard]},
  {path:"addProduct",component:AddProductsComponent,canActivate:[adminGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
