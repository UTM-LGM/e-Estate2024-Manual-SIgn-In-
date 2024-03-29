import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEstateComponent } from './add-estate/add-estate.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CostInfoComponent } from './cost-info/cost-info.component';
import { EstateDetailComponent } from './estate-detail/estate-detail.component';
import { EstateListComponent } from './estate-list/estate-list.component';
import { EstateComponent } from './estate-list-CompanyAdmin/estate.component';
import { FieldDetailComponent } from './field-detail/field-detail.component';
import { FieldInfoComponent } from './field-info/field-info.component';
import { FieldProductionComponent } from './field-production/field-production.component';
import { HomeComponent } from './home/home.component';
import { LaborInfoComponent } from './labor-info/labor-info.component';
import { LoginComponent } from './login/login.component';
import { CloneComponent } from './utility/clone/clone.component';
import { CostCategoryComponent } from './utility/cost-category/cost-category.component';
import { CostItemComponent } from './utility/cost-item/cost-item.component';
import { CountryComponent } from './utility/country/country.component';
import { CropCategoryComponent } from './utility/field-status/crop-category.component';
import { EstablishmentComponent } from './utility/establishment/establishment.component';
import { FinancialYearComponent } from './utility/financial-year/financial-year.component';
import { MembershipComponent } from './utility/membership/membership.component';
import { StateComponent } from './utility/state/state.component';
import { TownComponent } from './utility/town/town.component';
import { UtilityComponent } from './utility/utility.component';
import { HomeLayoutComponent } from './_layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './_layout/login-layout/login-layout.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_interceptor/auth.guard.interceptor';
import { RubberSalesComponent } from './rubber-sale/rubber-sales.component';
import { AddRubberSaleComponent } from './add-rubber-sale/add-rubber-sale.component';
import { ReportComponent } from './report/report.component';
import { UtilityClerkComponent } from './utility-clerk/utility-clerk.component';
import { RegisterBuyerComponent } from './utility-clerk/register-buyer/register-buyer.component';
import { AddRubberPurchaseComponent } from './add-rubber-purchase/add-rubber-purchase.component';
import { RubberPurchaseComponent } from './rubber-purchase/rubber-purchase.component';
import { LocalLaborTypeComponent } from './utility/local-labor-type/local-labor-type.component';
import { YieldProductionYearlyReportComponent } from './report/yield-production-yearly-report/yield-production-yearly-report.component';
import { CostTypeComponent } from './utility/cost-type/cost-type.component';
import { CloneProductivityYearlyComponent } from './report/clone-productivity-yearly/clone-productivity-yearly.component';
import { RegisterSellerComponent } from './utility-clerk/register-seller/register-seller.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NotificationComponent } from './notification/notification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AnnouncementComponent } from './utility/announcement/announcement.component';
import { FieldInfoYearlyComponent } from './field-info-yearly/field-info-yearly.component';
import { CompanyStatusComponent } from './report/company-status/company-status.component';
import { EstateStatusComponent } from './report/estate-status/estate-status.component';
import { OwnershipComponent } from './utility/ownership/ownership.component';
import { TappingSystemComponent } from './utility/tapping-system/tapping-system.component';
import { FieldDiseaseComponent } from './utility/field-disease/field-disease.component';
import { UtilityManageUserComponent } from './utility-manage-user/utility-manage-user.component';
import { PlantingMaterialComponent } from './utility/planting-material/planting-material.component';

const routes: Routes = [
  { path: '', redirectTo: 'e-estate', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ],
  },
  {
    path: 'register',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: RegisterComponent }
    ]
  },
  {
    path: 'verifyemail',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: VerifyEmailComponent },
    ],
  },
  {
    path: 'forgotpassword/:userId/:token',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: ForgotPasswordComponent },
    ],
  },
  {
    path: 'e-estate',
    component: HomeLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'company-list', component: CompanyListComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin'] } },
      { path: 'company-profile/:id', component: CompanyDetailComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin'] } },
      { path: 'estate/:id', component: EstateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'add-estate', component: AddEstateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'add-estate/:id', component: AddEstateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin'] } },
      { path: 'estate-list', component: EstateListComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin'] } },
      { path: 'estate-detail/:id', component: EstateDetailComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-info/:id', component: FieldInfoComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-detail/:id', component: FieldDetailComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-production/:id', component: FieldProductionComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'labor-info/:id', component: LaborInfoComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'cost-info/:id', component: CostInfoComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'rubber-sale/:id', component: RubberSalesComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'add-rubber-sale/:id', component: AddRubberSaleComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'rubber-purchase/:id', component: RubberPurchaseComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'add-rubber-purchase/:id', component: AddRubberPurchaseComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] } },
      { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard], data: { permittedRoles: ['EstateClerk'] } },
      { path: 'field-info-yearly/:id', component: FieldInfoYearlyComponent, canActivate: [AuthGuard], data: { permittedRoles: ['EstateClerk'] } },

      {
        path: 'utilities-admin',
        component: UtilityComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin'] },
        children: [
          { path: 'state', component: StateComponent },
          { path: 'financialYear', component: FinancialYearComponent },
          { path: 'membershipType', component: MembershipComponent },
          { path: 'establishment', component: EstablishmentComponent },
          { path: 'town', component: TownComponent },
          { path: 'crop-category', component: CropCategoryComponent },
          { path: 'clone', component: CloneComponent },
          { path: 'country', component: CountryComponent },
          { path: 'cost-category', component: CostCategoryComponent },
          { path: 'cost-type', component: CostTypeComponent },
          { path: 'cost-item', component: CostItemComponent },
          { path: 'labor-type', component: LocalLaborTypeComponent },
          { path: 'announcement', component: AnnouncementComponent },
          { path: 'ownership', component:OwnershipComponent },
          { path: 'tapping-system',component:TappingSystemComponent },
          { path: 'field-disease', component: FieldDiseaseComponent },
          { path: 'planting-material', component: PlantingMaterialComponent },

        ],
      },
      { path : 'utility-manage-user', component: UtilityManageUserComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin'] }},
      {
        path: 'utilities-clerk',
        component: UtilityClerkComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk'] },
        children: [
          { path: 'register-buyer', component: RegisterBuyerComponent },
          { path: 'register-seller', component: RegisterSellerComponent },

        ],
      },
      {
        path: 'reports',
        component: ReportComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'EstateClerk', 'CompanyAdmin'] },
        children: [
          { path: 'yield-production-yearly', component: YieldProductionYearlyReportComponent },
          { path: 'clone-production-yearly', component: CloneProductivityYearlyComponent },
          { path: 'company-status', component: CompanyStatusComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin'] } },
          { path: 'estate-status', component: EstateStatusComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'CompanyAdmin'] } },
        ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
