import { Component, OnInit } from '@angular/core';
import { FieldDisease } from 'src/app/_interface/fieldDisease';
import { FieldDiseaseService } from 'src/app/_services/field-disease.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-field-disease',
  templateUrl: './field-disease.component.html',
  styleUrls: ['./field-disease.component.css']
})
export class FieldDiseaseComponent implements OnInit {

  fieldDisease:FieldDisease = {} as FieldDisease
  fieldDiseases:FieldDisease [] = []

  term = ''
  order = ''
  currentSortedColumn = ''
  pageNumber = 1
  isLoading = true

  sortableColumns = [
    { columnName: 'diseaseName', displayText: 'Field Disease Name' },
  ];


  constructor(
    private sharedService:SharedService,
    private fieldDiseaseService:FieldDiseaseService
  ){}

  ngOnInit(): void {
    this.fieldDisease.diseaseName = ''
    this,this.getFieldDisease()
  }

  getFieldDisease(){
    setTimeout(() =>{
      this.fieldDiseaseService.getFieldDisease()
      .subscribe(
        Response =>{
          this.fieldDiseases = Response
          this.isLoading = false
        }
      )
    })
  }

  submit(){
    if(this.fieldDisease.diseaseName === ''){
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.fieldDiseases.some(s=>s.diseaseName.toLowerCase() === this.fieldDisease.diseaseName.toLowerCase()))
    {
      swal.fire({
        text: 'Disease Name already exists!',
        icon: 'error'
      });
    } else {
      this.fieldDisease.isActive = true
      this.fieldDisease.createdBy = this.sharedService.userId.toString()
      this.fieldDisease.createdDate = new Date()
      this.fieldDiseaseService.addFieldDisease(this.fieldDisease)
      .subscribe(
        Response =>{
          swal.fire({
            title: 'Done!',
            text: 'Field Disease successfully submitted!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.reset()
          this.ngOnInit()
        }
      )
    }
  }

  reset(){
    this.fieldDisease = {} as FieldDisease
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  status(fieldDisease:FieldDisease){
    fieldDisease.updatedBy = this.sharedService.userId.toString()
    fieldDisease.updatedDate = new Date()
    fieldDisease.isActive = !fieldDisease.isActive
    this.fieldDiseaseService.updateFieldDisease(fieldDisease)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'Field Disease successfully updated!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.ngOnInit()
      }
    )
  }
}
