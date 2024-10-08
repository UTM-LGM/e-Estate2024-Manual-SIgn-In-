import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../_services/report.service';
import { BadgeService } from '../_services/badge.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductionComparisonComponent } from '../production-comparison/production-comparison.component';
import { ProductionComparisonService } from '../_services/production-comparison.service';
import { ProductionComparison } from '../_interface/productionComparison';
import { FieldInfoYearlyService } from '../_services/field-info-yearly.service';
import { FieldInfoYearly } from '../_interface/fieldInfoYearly';
import { SharedService } from '../_services/shared.service';
import { SubscriptionService } from '../_services/subscription.service';
import { DatePipe } from '@angular/common';
import { FieldProductionService } from '../_services/field-production.service';
import { CostAmountService } from '../_services/cost-amount.service';
import { FieldService } from '../_services/field.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  showAlertField = false
  showAlertProduction = false
  showEmptyMessage = true
  yearNow = 0
  estateId = 0
  sumTotalDryPreviousMonthYear = 0
  sumTotalDryCurrentMonthYear = 0
  message = ''

  responsePreviousMonthYear: any[] = []
  responseCurrentMonthYear: any[] = []

  filterProduction: ProductionComparison[] = []
  fieldInfo: FieldInfoYearly[] = []

  warningProductionDrafted = false
  warningCostDrafted = false
  warningGrantTitle = false

  constructor(
    private reportService: ReportService,
    private badgeService: BadgeService,
    private dialog: MatDialog,
    private productionComparisonService: ProductionComparisonService,
    private fieldInfoYearlyService: FieldInfoYearlyService,
    private sharedService: SharedService,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe,
    private productionService:FieldProductionService,
    private costInformationService:CostAmountService,
    private fieldService:FieldService

  ) { }

  ngOnInit() {
    this.yearNow = new Date().getFullYear()
    this.estateId = this.sharedService.estateId
    this.getProductionDrafted()
    this.getGrantTitle()
  }

  getProductionDrafted(){
    const previousMonth = new Date()
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const date = this.datePipe.transform(previousMonth, 'MMM-yyyy')
    const getProduction = this.productionService.getProduction()
    .subscribe(
      Response =>{
        const production = Response.filter(x=>x.estateId == this.sharedService.estateId && x.status == "DRAFT" && x.monthYear == date?.toUpperCase())
        if(production.length > 0)
          {
            
            this.warningProductionDrafted = true
            this.showEmptyMessage = false
            this.updateBadge()
          }
      }
    )
    this.subscriptionService.add(getProduction);
  }

  getGrantTitle(){
    const getField = this.fieldService.getField()
    .subscribe(
      Response =>{
        const field = Response.filter(x=>x.estateId == this.sharedService.estateId)
        field.forEach(field =>{
          if(field.fieldGrants && field.fieldGrants.length == 0 || field.fieldGrants.some((g:any) => g.isActive === false)){
            this.warningGrantTitle = true
            this.showEmptyMessage = false
            this.updateBadge()
          }
        })
      }
    )
  }  

  updateBadge() {
    const badgeCount = (this.showAlertField ? 1 : 0) + (this.showAlertProduction ? 1 : 0) + (this.warningProductionDrafted ? 1 : 0) + (this.warningCostDrafted ? 1:0)
    + (this.warningGrantTitle ? 1:0)
    this.badgeService.updateBadgeCount(badgeCount)
    if (badgeCount === 0) {
      this.showEmptyMessage = true
    }
  }

  openDialog(currentYear: number, previousYear: number) {
    const dialogRef = this.dialog.open(ProductionComparisonComponent, {
      data: { data: currentYear, previousYear },
    });

    dialogRef.afterClosed()
      .subscribe(
        Response => {
          setTimeout(() => {
            location.reload()
          }, 1000);
        }
      )
  }

  getFieldInfoYearly() {
    const today = new Date()
    const isNovember = today.getMonth() === 1 // Note: JavaScript months are 0-based
    const getExtra = this.fieldInfoYearlyService.getExtraFieldInfo(this.yearNow)
      .subscribe(
        Response => {
          this.fieldInfo = Response
          //December every year can see
          if (this.fieldInfo.length == 0) {
            this.showAlertField = true
          }
        }
      )
      this.subscriptionService.add(getExtra);

  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
}
