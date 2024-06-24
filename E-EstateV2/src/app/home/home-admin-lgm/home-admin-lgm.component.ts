import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { forkJoin, map } from 'rxjs';
import { Company } from 'src/app/_interface/company';
import { Estate } from 'src/app/_interface/estate';
import { FieldProduction } from 'src/app/_interface/fieldProduction';
import { FieldService } from 'src/app/_services/field.service';
import { MyLesenIntegrationService } from 'src/app/_services/my-lesen-integration.service';
import { ReportService } from 'src/app/_services/report.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-home-admin-lgm',
  templateUrl: './home-admin-lgm.component.html',
  styleUrls: ['./home-admin-lgm.component.css']
})
export class HomeAdminLGMComponent implements OnInit, OnDestroy {

  totalEstate = 0
  totalCompany = 0
  yearNow = 0

  totalCuplumpDry = 0
  totalLatexDry = 0

  productivityCuplumpDry = 0
  productivityLatexDry = 0
  productivityUSSDry = 0
  productivityOthersDry = 0

  currentTotalTapper = 0
  currentTotalField = 0

  filterEstates: Estate[] = []

  filterCompanies: Company[] = []

  productions: FieldProduction[] = []
  productivity: any[] = []
  workerShortages: any[] = []


  isLoadingCompany = true
  isLoadingEstate = true
  isLoadingTapper = true
  isLoadingField = true
  isLoadingTapperNeeded = true
  isLoadingFieldNeeded = true
  isLoadingProduction = true
  isLoadingTapperShortage = true
  isLoadingFieldShortage = true
  isLoadingTapped = true
  isLoadingCop = true

  chart: any
  productivityByYear:any

  totalTapperNeeded = 0
  totalFieldNeeded = 0
  tapperShortage = 0
  fieldShortage =0
  tappedArea = 0
  costAmount = 0


  constructor(
    private myLesenService: MyLesenIntegrationService,
    private reportService: ReportService,
    private fieldService:FieldService,
    private subscriptionService:SubscriptionService

  ) { }

  ngOnInit() {
    this.getCompany()
    this.getEstate()
    this.getProduction()
    this.yearNow = new Date().getFullYear()
    this.getWorker()
    this.getWorkerShortage()
    this.getField()
    this.getCostInformation()
  }

  ngAfterViewInit() {
    this.getProductivity()

  }

  getCostInformation(){
    const getCostInformation = this.reportService.getCostInformation(this.yearNow.toString())
    .subscribe(
      Response =>{
        this.costAmount = Response.reduce((sum, estate)=> sum + estate.amount, 0)
        this.isLoadingCop = false
      }
    )
    this.subscriptionService.add(getCostInformation);

  }

  getField(){
    const getCurrentField = this.reportService.getCurrentField(this.yearNow.toString())
    .subscribe(
      Response =>{
        const field = Response.filter(x=>x.isActive == true && x.fieldStatus.toLowerCase().includes('tapped area'))
        this.tappedArea = field.reduce((sum, field) => sum + field.area, 0)
        this.isLoadingTapped = false
      }
    )
    this.subscriptionService.add(getCurrentField);
    
  }

  getWorkerShortage() {
    const getWorkerShortage = this.reportService.getWorkerShortageEstate(this.yearNow.toString()).subscribe(
      response => {
        this.workerShortages = response;
        if(this.workerShortages.length === 0)
          {
            this.totalTapperNeeded = 0
            this.totalFieldNeeded = 0
            this.tapperShortage = 0
            this.fieldShortage = 0
            this.isLoadingTapperNeeded = false
            this.isLoadingFieldNeeded = false
            this.isLoadingTapperShortage = false
            this.isLoadingFieldShortage = false
          }
          else{
            this.tapperShortage = this.workerShortages.reduce((sum, workerShortage) => sum + workerShortage.tapperShortage, 0)
            this.fieldShortage = this.workerShortages.reduce((sum, workerShortage) => sum + workerShortage.fieldShortage, 0);
            this.isLoadingTapperShortage = false
            this.isLoadingFieldShortage = false
            const estateRequests = this.workerShortages.map(workerShortage => {
              return this.myLesenService.getOneEstate(workerShortage.estateId).pipe(
                map(estateResponse => {
                  workerShortage.estateName = estateResponse.name; // Assuming estate name is in 'name' property
                })
              );
            });
            forkJoin(estateRequests).subscribe(() => {
              this.getLabor();
            });
          }
      }
    );
    this.subscriptionService.add(getWorkerShortage);

  }

  getLabor() {
    const getLabor = this.reportService.getCurrentTapperAndFieldWorker().subscribe(
      Response => {
        const labors = Response;
        this.workerShortages.forEach(workerShortage => {
          workerShortage.filterLabors = labors.filter(e => e.estateId == workerShortage.estateId);
        });
        this.totalTapperNeeded = this.calculateTotalTapperSum(this.workerShortages);
        this.totalFieldNeeded = this.calculateTotalFieldSum(this.workerShortages);
        this.isLoadingTapperNeeded = false
        this.isLoadingFieldNeeded = false
      }
    );
    this.subscriptionService.add(getLabor);

  }

  calculateTapperSum(worker: any): number {
    if (worker && worker.filterLabors && worker.tapperShortage) {
      return worker.filterLabors.reduce((sum:any, labor:any) => sum + labor.tapperCheckrole + labor.tapperContractor, 0) + worker.tapperShortage;
    } else {
      return 0; // Return 0 if any of the properties are undefined or null
    }
  }
  
  
  calculateFieldSum(worker: any) {
    if (worker && worker.filterLabors && worker.tapperShortage) {
      return worker.filterLabors.reduce((sum:any, labor:any) => sum + labor.fieldCheckrole + labor.fieldContractor, 0) + worker.fieldShortage;
    } else {
      return 0; // Return 0 if any of the properties are undefined or null
    }
  }

  calculateTotalTapperSum(workerShortages: any[]): number {
    return workerShortages.reduce((sum, workerShortage) => sum + this.calculateTapperSum(workerShortage), 0);
  }
  
  calculateTotalFieldSum(workerShortages: any[]): number {
    return workerShortages.reduce((sum, workerShortage) => sum + this.calculateFieldSum(workerShortage), 0);
  }

  getCompany() {
    const getCompany = this.myLesenService.getAllCompany()
      .subscribe(
        Response => {
          this.filterCompanies = Response
          this.totalCompany = this.filterCompanies.length
          this.isLoadingCompany = false
        }
      )
    this.subscriptionService.add(getCompany);


  }

  getEstate() {
    const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterEstates = Response
          this.totalEstate = this.filterEstates.length
          this.isLoadingEstate = false
        }
      )
      this.subscriptionService.add(getAllEstate);
    
  }

  getProduction() {
    const getProduction = this.reportService.getCurrentCropProduction()
      .subscribe(
        Response => {
          this.productions = Response
          if (this.productions.length === 0) {
            const product: any = {
              cuplumpDry: 0,
              latexDry: 0,
              ussDry: 0,
              othersDry: 0,
            };
            this.productions.push(product)
            
          }
          else {
            for (const production of this.productions) {
              this.totalCuplumpDry += production.cuplumpDry || 0;
              this.totalLatexDry += production.latexDry || 0;
              this.isLoadingProduction = false
            }
          }
        }
      )
    this.subscriptionService.add(getProduction);

  }

  getProductivity() {
    const getProductivity = this.reportService.getCropProductivity()
      .subscribe({
        next: (Response) => {
          this.productivity = Response;
          if (this.productivity.length === 0) {
            const product: any = {
              totalCuplumpDry: 0,
              totalLatexDry: 0,
              totalArea: 0,
              totalRubberDry : 0
            };
            this.productivity.push(product);
          } else {
            this.productivityByYear = this.groupByYear(this.productivity);
            // this.createProductivityChart(); // Call chart creation after data is processed
          }
          this.isLoadingProduction = false;
        },
        error: (err) => {
          console.error('Error fetching productivity data:', err);
          this.isLoadingProduction = false;
        }
      });
    this.subscriptionService.add(getProductivity);

  }

  // Helper function to group data by year and calculate sums
groupByYear(data: any) {
  const grouped = data.reduce((acc: any, curr: any) => {
    const year = curr.year;
    if (!acc[year]) {
      acc[year] = {
        year: year,
        totalCuplumpDry: 0,
        totalLatexDry: 0,
        totalArea: 0,
        totalRubberDry : 0
      };
    }
    acc[year].totalCuplumpDry += curr.totalCuplumpDry || 0;
    acc[year].totalLatexDry += curr.totalLatexDry || 0;
    acc[year].totalRubberDry += (curr.totalCuplumpDry || 0) + (curr.totalLatexDry || 0);
    acc[year].totalArea += curr.area || 0;
    return acc;
  }, {});

  // Convert the grouped object into an array
  return Object.values(grouped);
}

  
  // createProductivityChart() {
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //   const years = this.productivityByYear.map((x: any) => x.year);
  //   const totalRubberProductivity = this.productivityByYear.map((x:any)=> x.totalRubberDry/x.totalArea);
  
  //   this.chart = new Chart("chartProductivityAdmin", {
  //     type: 'line',
  //     data: {
  //       labels: years,
  //       datasets: [
  //         {
  //           label: 'Rubber Dry (Kg/Ha)',
  //           data: totalRubberProductivity,
  //           backgroundColor: 'blue',
  //           borderColor: 'blue',
  //           fill: false
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false
  //     }
  //   });
  // }
  
  getWorker() {
   const getCurrent =  this.reportService.getCurrentTapperAndFieldWorker()
      .subscribe(
        Response => {
          if (Response.length === 0) {
            this.currentTotalTapper = 0;
            this.currentTotalField = 0;
            this.isLoadingTapper = false
            this.isLoadingField = false


          } else {
            Response.forEach(item => {
              // Add values with "tapper" in their keys to currentTotalTapper
              this.currentTotalTapper += item.tapperCheckrole + item.tapperContractor;
              this.isLoadingTapper = false
  
              // Add values with "field" in their keys to currentTotalField
              this.currentTotalField += item.fieldCheckrole + item.fieldContractor;
              this.isLoadingField = false
            });
          }
          
          
        }
      )
    this.subscriptionService.add(getCurrent);

  }

  getCalculatedCop(){
    if(this.totalCuplumpDry == 0 || this.totalLatexDry == 0 || this.costAmount == 0){
      return  0 
    }else{
      const value = (this.totalCuplumpDry + this.totalLatexDry) / this.costAmount;
      return isNaN(value) ? 0 : value;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }
  
}
