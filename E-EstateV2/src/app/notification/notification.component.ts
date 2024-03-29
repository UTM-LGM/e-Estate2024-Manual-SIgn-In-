import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../_interceptor/auth.guard.interceptor';
import { ReportService } from '../_services/report.service';
import { BadgeService } from '../_services/badge.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductionComparisonComponent } from '../production-comparison/production-comparison.component';
import { ProductionComparisonService } from '../_services/production-comparison.service';
import { ProductionComparison } from '../_interface/productionComparison';
import { FieldInfoYearlyService } from '../_services/field-info-yearly.service';
import { FieldInfoYearly } from '../_interface/fieldInfoYearly';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  showAlertField = false
  showAlertProduction = false
  showEmptyMessage = false
  yearNow = 0
  estateId = ''
  sumTotalDryPreviousMonthYear = 0
  sumTotalDryCurrentMonthYear = 0
  message = ''

  responsePreviousMonthYear: any[] = []
  responseCurrentMonthYear: any[] = []

  filterProduction: ProductionComparison[] = []
  fieldInfo: FieldInfoYearly[] = []

  constructor(
    private authGuard: AuthGuard,
    private reportService: ReportService,
    private badgeService: BadgeService,
    private dialog: MatDialog,
    private productionComparisonService: ProductionComparisonService,
    private fieldInfoYearlyService: FieldInfoYearlyService
  ) { }

  ngOnInit() {
    this.yearNow = new Date().getFullYear()
    this.estateId = this.authGuard.getEstateId()
    this.checkProduction()
    this.getFieldInfoYearly()
  }

  checkProduction() {
    const currentDate = new Date()
    // const currentYear = currentDate.getFullYear()
    // const previousYear = currentDate.getFullYear() - 1
    const previousYear = 2010
    const currentYear = 2011
    this.reportService.getEstateProductivityByField(previousYear.toString())
      .subscribe(
        (Response: any) => {
          const production = Response.production
          const previousMonthYear = Response.monthYear
          this.responsePreviousMonthYear = previousMonthYear.filter((x: any) => x.estateId == this.estateId)
          const filterProduction = production.filter((x: { estateId: string; }) => x.estateId == this.estateId)
          const totalDry = filterProduction.map((x: any) => x.cuplumpDry + x.latexDry + x.ussDry + x.othersDry)
          this.sumTotalDryPreviousMonthYear = totalDry.reduce((acc: number, value: number) => acc + value, 0)

          this.reportService.getEstateProductivityByField(currentYear.toString())
            .subscribe(
              (Response: any) => {
                const production = Response.production
                const currentMonthYear = Response.monthYear
                this.responseCurrentMonthYear = currentMonthYear.filter((x: any) => x.estateId == this.estateId)
                const filterProduction = production.filter((x: { estateId: string; }) => x.estateId == this.estateId)
                const totalDry = filterProduction.map((x: any) => x.cuplumpDry + x.latexDry + x.ussDry + x.othersDry)
                this.sumTotalDryCurrentMonthYear = totalDry.reduce((acc: number, value: number) => acc + value, 0);

                this.productionComparisonService.getProductionComparison()
                  .subscribe(
                    Response => {
                      const production = Response
                      this.filterProduction = production.filter(x => x.estateId == parseInt(this.estateId) && x.createdYear == currentYear)

                      if (this.responsePreviousMonthYear.some((item) => item.monthYear.includes('Dec')) &&
                        this.responseCurrentMonthYear.some((item) => item.monthYear.includes('Dec')) && this.filterProduction.length == 0) {
                        if (this.sumTotalDryCurrentMonthYear < this.sumTotalDryPreviousMonthYear) {
                          this.message = 'lower'
                        }
                        else if (this.sumTotalDryCurrentMonthYear > this.sumTotalDryPreviousMonthYear) {
                          this.message = 'higher'
                        }
                        this.showAlertProduction = true
                        this.updateBadge()
                      }
                      this.updateBadge()
                    }
                  )
              }
            )
        }
      )
  }

  updateBadge() {
    const badgeCount = (this.showAlertField ? 1 : 0) + (this.showAlertProduction ? 1 : 0)
    this.badgeService.updateBadgeCount(badgeCount)
    if (badgeCount == 0) {
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
    // this.yearNow = 2021
    this.fieldInfoYearlyService.getExtraFieldInfo(this.yearNow)
      .subscribe(
        Response => {
          this.fieldInfo = Response
          if (isNovember && this.fieldInfo.length == 0) {
            this.showAlertField = true
          }
        }
      )
  }
}
