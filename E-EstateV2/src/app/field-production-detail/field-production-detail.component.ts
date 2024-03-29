import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FieldProduction } from '../_interface/fieldProduction';
import swal from 'sweetalert2';
import { FieldProductionComponent } from '../field-production/field-production.component';
import { SharedService } from '../_services/shared.service';
import { FieldProductionService } from '../_services/field-production.service';

@Component({
  selector: 'app-field-production-detail',
  templateUrl: './field-production-detail.component.html',
  styleUrls: ['./field-production-detail.component.css'],
})
export class FieldProductionDetailComponent implements OnInit {
  product: FieldProduction = {} as FieldProduction

  constructor(
    public dialogRef: MatDialogRef<FieldProductionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: FieldProduction },
    private fieldProductionService: FieldProductionService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.product = this.data.data
  }

  update() {
    this.product.updatedBy = this.sharedService.userId.toString()
    this.product.updatedDate = new Date()
    this.fieldProductionService.updateProduction(this.product)
      .subscribe(
        {
          next: (Response) => {
            swal.fire({
              title: 'Done!',
              text: 'Production successfully updated!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.dialogRef.close()
          },
          error: (err) => {
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please insert all value',
            });
          }
        });
  }

  back() {
    this.dialogRef.close()
  }

  validateInputCuplump(product: any) {
    if (product.cuplumpDRC < 39 || product.cuplumpDRC > 80) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert cuplump DRC between 39% - 80% only',
      });
      product.cuplumpDRC = null
    }
  }

  validateInputLatex(product: any) {
    if (product.latexDRC < 20 || product.latexDRC > 55) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please insert latex DRC between 20% - 55% only',
      });
      product.latexDRC = null
    }
  }

  taskTap(taskTap: any, totalTask: number) {
    this.product.noTaskUntap = totalTask - taskTap
  }

  initialZeroCuplump(index:any){
    if(index == 0){
      this.product.cuplumpDRC = 0
    }
  }

  initialZeroLatex(index:any){
    if(index == 0){
      this.product.latexDRC = 0
    }
  }

  initialZeroUSS(index:any){
    if(index == 0){
      this.product.ussDRC = 0
    }
  }

  initialZeroOthers(index:any){
    if(index == 0){
      this.product.othersDRC = 0
    }
  }

}
