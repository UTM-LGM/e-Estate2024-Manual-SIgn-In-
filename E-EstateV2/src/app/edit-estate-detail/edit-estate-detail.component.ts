import { Component, OnInit } from '@angular/core';
import { Estate } from '../_interface/estate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { State } from '../_interface/state';
import { Town } from '../_interface/town';
import { FinancialYear } from '../_interface/financialYear';
import { Establishment } from '../_interface/establishment';
import { MembershipType } from '../_interface/membership';
import swal from 'sweetalert2';
import { EstateService } from '../_services/estate.service';
import { SharedService } from '../_services/shared.service';
import { StateService } from '../_services/state.service';
import { TownService } from '../_services/town.service';
import { FinancialYearService } from '../_services/financial-year.service';
import { MembershipService } from '../_services/membership.service';
import { EstablishmentService } from '../_services/establishment.service';
import { PlantingMaterialService } from '../_services/planting-material.service';
import { PlantingMaterial } from '../_interface/planting-material';

@Component({
  selector: 'app-edit-estate-detail',
  templateUrl: './edit-estate-detail.component.html',
  styleUrls: ['./edit-estate-detail.component.css']
})
export class EditEstateDetailComponent implements OnInit {

  estate: Estate = {} as Estate
  filteredEstate: any = {} as any


  filterStates: State[] = []

  towns: Town[] = []
  filterTown: Town[] = []
  filterTowns: Town[] = []

  filterFinancialYears: FinancialYear[] = []

  filterMemberships: MembershipType[] = []

  filterEstablishments: Establishment[] = []

  filterPlantingMaterial:PlantingMaterial[]=[]

  town = true

  constructor(
    public dialog: MatDialogRef<Estate>,
    @Inject(MAT_DIALOG_DATA) public data: { data: Estate },
    private stateService: StateService,
    private townService: TownService,
    private financialYearService: FinancialYearService,
    private membershipService: MembershipService,
    private establishmentService: EstablishmentService,
    private estateService: EstateService,
    private sharedService: SharedService,
    private plantingMaterialService:PlantingMaterialService
  ) { }

  ngOnInit() {
    this.estate = this.data.data
    this.getState()
    this.getTown()
    this.getFinancialYear()
    this.getMembership()
    this.getEstablishment()
    this.getPlantingMaterial()
  }

  getFinancialYear() {
    this.financialYearService.getFinancialYear()
      .subscribe(
        Response => {
          const financialYears = Response
          this.filterFinancialYears = financialYears.filter(e => e.isActive == true)
        });
  }

  getPlantingMaterial(){
    this.plantingMaterialService.getPlantingMaterial()
    .subscribe(
      Response =>{
        const plantingMaterial = Response
        this.filterPlantingMaterial = plantingMaterial.filter(p => p.isActive == true)
      }
    )
  }

  getMembership() {
    this.membershipService.getMembership()
      .subscribe(
        Response => {
          const memberships = Response
          this.filterMemberships = memberships.filter(e => e.isActive == true)
        });
  }

  getEstablishment() {
    this.establishmentService.getEstablishment()
      .subscribe(
        Response => {
          const establishments = Response
          this.filterEstablishments = establishments.filter(e => e.isActive == true)
        });
  }

  gettown(event: any) {
    this.estate.townId = 0
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

  getState() {
    this.stateService.getState()
      .subscribe(
        Response => {
          const states = Response
          this.filterStates = states.filter(e => e.isActive == true)
        });
  }

  back() {
    this.dialog.close()
  }

  update() {
    this.estate.updatedBy = this.sharedService.userId.toString()
    this.estate.updatedDate = new Date()
    const {plantingMaterial, ...newObj} = this.estate
    this.filteredEstate = newObj
    this.estateService.updateEstate(this.filteredEstate)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Estate successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialog.close()
        }
      )
  }

}
