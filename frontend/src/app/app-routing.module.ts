import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { LoginComponent } from './login/login.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';
import { MainComponent } from './dashboard/children/main/main.component';
import { ProfileComponent } from './dashboard/children/profile/profile.component';
import { UserManagerComponent } from './dashboard/children/user-manager/user-manager.component';
import { WarehouseManagerComponent } from './dashboard/children/warehouse-manager/warehouse-manager.component';
import { AdminGuard } from './guards/admin.guard';
import { ReceptionComponent } from './dashboard/children/reception/reception.component';
import { ReceptionGuard } from './guards/reception.guard';
import { FamilyComponent } from './dashboard/children/family/family.component';
import { FamilyGuard } from './guards/family.guard';
import { WarehouseGuard } from './guards/warehouse.guard';
import { CashComponent } from './dashboard/children/cash/cash.component';
import { CashGuard } from './guards/cash.guard';
import { AboutComponent } from './about/about.component';
import { UserManagerDetailComponent } from './dashboard/children/user-manager-detail/user-manager-detail.component';
import { UserManagerCreateComponent } from './dashboard/children/user-manager-create/user-manager-create.component';
import { WarehouseManagerCreateComponent } from './dashboard/children/warehouse-manager-create/warehouse-manager-create.component';
import { WarehouseManagerDetailComponent } from './dashboard/children/warehouse-manager-detail/warehouse-manager-detail.component';
import { WarehouseComponent } from './dashboard/children/warehouse/warehouse.component';
import { ProductManagerComponent } from './dashboard/children/product-manager/product-manager.component';
import { ProductManagerCreateComponent } from './dashboard/children/product-manager-create/product-manager-create.component';
import { ProductManagerDetailComponent } from './dashboard/children/product-manager-detail/product-manager-detail.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'invoice/:id',
    component: InvoiceComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [LoggedInGuard],
    children: [{
      path: '',
      component: MainComponent
    }, {
      path: 'about',
      component: AboutComponent
    }, {
      path: 'profile',
      component: ProfileComponent
    }, {
      path: 'reception',
      component: ReceptionComponent,
      canActivate: [ReceptionGuard]
    }, {
      path: 'family',
      component: FamilyComponent,
      canActivate: [FamilyGuard]
    }, {
      path: 'warehouse',
      component: WarehouseComponent,
      canActivate: [WarehouseGuard]
    }, {
      path: 'cash',
      component: CashComponent,
      canActivate: [CashGuard]
    }, {
      path: 'user-manager',
      component: UserManagerComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'user-manager-create',
      component: UserManagerCreateComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'user-manager/:id',
      component: UserManagerDetailComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'warehouse-manager',
      component: WarehouseManagerComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'warehouse-manager-create',
      component: WarehouseManagerCreateComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'warehouse-manager/:id',
      component: WarehouseManagerDetailComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'product-manager',
      component: ProductManagerComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'product-manager-create',
      component: ProductManagerCreateComponent,
      canActivate: [AdminGuard]
    }, {
      path: 'product-manager/:id',
      component: ProductManagerDetailComponent,
      canActivate: [AdminGuard]
    },
    ]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
