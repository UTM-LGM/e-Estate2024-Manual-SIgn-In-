import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from '../_interface/company';
import { StateService } from '../_services/state.service';
import { TownService } from '../_services/town.service';
import { State } from '../_interface/state';
import { Town } from '../_interface/town';
import { CompanyService } from '../_services/company.service';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { CompanyDetail } from '../_interface/company-detail';
import { MembershipType } from '../_interface/membership';
import { MembershipService } from '../_services/membership.service';
import { CompanyDetailService } from '../_services/company-detail.service';


@Component({
  selector: 'app-edit-company-detail',
  templateUrl: './edit-company-detail.component.html',
  styleUrls: ['./edit-company-detail.component.css']
})
export class EditCompanyDetailComponent {

  company: any = {} as any

  companyDetail: CompanyDetail = {} as CompanyDetail

  filteredCompany: any = {} as any


  filterStates: State[] = []
  towns: Town[] = []
  filterTowns: Town[] = []
  filterTown: Town[] = []

  filterMemberships: MembershipType[] = []


  town = true;

  constructor(
    public dialog: MatDialogRef<Company>,
    @Inject(MAT_DIALOG_DATA) public data: { data: any, companyDetail: CompanyDetail },
    private stateService: StateService,
    private townService: TownService,
    private sharedService: SharedService,
    private membershipService: MembershipService,
    private companyDetailService: CompanyDetailService
  ) { }

  ngOnInit() {
    this.company = this.data.data
    this.companyDetail = this.data.companyDetail
    this.getState()
    this.getTown()
    this.getMembership()
  }

  getState() {
    this.stateService.getState()
      .subscribe(
        Response => {
          const states = Response
          this.filterStates = states.filter(e => e.isActive == true)
        });
  }

  getMembership() {
    this.membershipService.getMembership()
      .subscribe(
        Response => {
          const memberships = Response
          this.filterMemberships = memberships.filter(e => e.isActive == true)
        });
  }

  gettown(event: any) {
    this.company.townId = 0
    this.filterTown = this.towns.filter(e => e.stateId == event.value)
    this.filterTowns = this.filterTown.filter(e => e.isActive == true)
    this.town = false
  }

  getTown() {
    this.townService.getTown()
      .subscribe(
        Response => {
          this.towns = Response
          this.filterTowns = this.towns.filter(e => e.isActive == true)
        });
  }

  update() {
    if (this.companyDetail.id == undefined) {
      this.companyDetail.companyId = this.company.id
      this.companyDetail.membershipId = this.companyDetail.membershipId
      this.companyDetail.createdBy = this.sharedService.userId.toString()
      this.companyDetail.createdDate = new Date()
      this.companyDetailService.addCompanyDetail(this.companyDetail)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Company successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close()
          }
        )
    } else {
      this.companyDetail.membershipId = this.companyDetail.membershipId
      this.companyDetail.updatedBy = this.sharedService.userId.toString()
      this.companyDetail.updatedDate = new Date()
      const { membership, ...newObj } = this.companyDetail
      this.filteredCompany = newObj
      this.companyDetailService.updateCompanyDetail(this.filteredCompany)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Company successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialog.close()
          })
    }
  }

  back() {
    this.dialog.close()
  }

}
