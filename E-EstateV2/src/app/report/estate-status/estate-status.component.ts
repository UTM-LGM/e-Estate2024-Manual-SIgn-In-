import { Component, OnInit } from '@angular/core';
import { Estate } from 'src/app/_interface/estate';
import { EstateService } from 'src/app/_services/estate.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-estate-status',
  templateUrl: './estate-status.component.html',
  styleUrls: ['./estate-status.component.css']
})
export class EstateStatusComponent implements OnInit {

  pageNumber = 1
  status = '0'
  term = ''
  isLoading = false
  isActiveChoosen = false
  role = ''

  estates: Estate[] = []

  constructor(
    private estateService: EstateService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.role = this.sharedService.role
  }

  statusSelected(event: any) {
    this.isLoading = true
    this.isActiveChoosen = false
    this.getEstate(event)
  }

  getEstate(isActive: boolean) {
    setTimeout(() => {
      this.estateService.getEstate()
        .subscribe(
          Response => {
            this.isActiveChoosen = true
            const estates = Response
            this.estates = estates.filter(x => x.isActive == isActive)
            if (this.role == "CompanyAdmin") {
              this.estates = estates.filter(x => x.isActive == isActive && x.companyId == this.sharedService.companyId)
            }
            this.isLoading = false
          }
        );
    }, 2000)
  }
}
