import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './dashboard/children/main/main.component';
import { LoadingComponent } from './loading/loading.component';
import { UserManagerComponent } from './dashboard/children/user-manager/user-manager.component';
import { ProfileComponent } from './dashboard/children/profile/profile.component';
import { WarehouseManagerComponent } from './dashboard/children/warehouse-manager/warehouse-manager.component';
import { WarehouseComponent } from './dashboard/children/warehouse/warehouse.component';
import { ReceptionComponent } from './dashboard/children/reception/reception.component';
import { CashComponent } from './dashboard/children/cash/cash.component';
import { FamilyComponent } from './dashboard/children/family/family.component';
import { AboutComponent } from './about/about.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserManagerDetailComponent } from './dashboard/children/user-manager-detail/user-manager-detail.component';
import { UserManagerCreateComponent } from './dashboard/children/user-manager-create/user-manager-create.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    MainComponent,
    LoadingComponent,
    UserManagerComponent,
    ProfileComponent,
    WarehouseManagerComponent,
    WarehouseComponent,
    ReceptionComponent,
    CashComponent,
    FamilyComponent,
    AboutComponent,
    UserManagerDetailComponent,
    UserManagerCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatGridListModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
