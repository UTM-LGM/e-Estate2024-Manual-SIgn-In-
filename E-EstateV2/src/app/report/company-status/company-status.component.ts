import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from 'src/app/_interface/company';
import { CompanyService } from 'src/app/_services/company.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-company-status',
  templateUrl: './company-status.component.html',
  styleUrls: ['./company-status.component.css']
})
export class CompanyStatusComponent implements OnInit, OnDestroy{

  status = '0'
  term = ''
  isLoading = false
  isActiveChoosen = false
  pageNumber = 1

  companies: Company[] = []

  constructor(
    private companyService: CompanyService,
    private subscriptionService:SubscriptionService
  ) { }

  ngOnInit(): void {

  }

  statusSelected(event: any) {
    this.isLoading = true
    this.isActiveChoosen = false
    this.getCompany(event)
  }

  getCompany(isActive: boolean) {
    setTimeout(() => {
      const getCompany = this.companyService.getCompany()
        .subscribe(
          Response => {
            this.isActiveChoosen = true
            const companies = Response
            this.companies = companies.filter(x => x.isActive == isActive)
            this.isLoading = false
          });
      this.subscriptionService.add(getCompany);
          
    }, 2000)
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  onFilterChange(term: string): void {
    this.term = term;
    this.pageNumber = 1; // Reset to first page on filter change
  }
}
