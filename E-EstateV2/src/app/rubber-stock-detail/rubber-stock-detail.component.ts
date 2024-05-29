import { Component, Inject, OnInit } from '@angular/core';
import { RubberStockService } from '../_services/rubber-stock.service';
import { RubberStock } from '../_interface/rubberStock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../_services/shared.service';
import swal from 'sweetalert2';
import { RubberStockComponent } from '../rubber-stock/rubber-stock.component';

@Component({
  selector: 'app-rubber-stock-detail',
  templateUrl: './rubber-stock-detail.component.html',
  styleUrls: ['./rubber-stock-detail.component.css']
})
export class RubberStockDetailComponent implements OnInit {

  estate: any = {} as any

  rubberStocks: RubberStock[] = []
  stock = {} as RubberStock

  isLoadingProduction = true
  isLoadingSale = true

  isPreviousStock = false

  constructor(
    private rubberStockService: RubberStockService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<RubberStockComponent>,
  ) {
    this.estate = data.estate;
    if (this.data.stock.id != undefined) {
      this.isLoadingProduction = false
      this.isLoadingSale = false
      this.stock = data.stock
    }
  }

  ngOnInit(): void {
  }

  calculateWaterDepletion() {
    const production = this.stock.totalProduction + this.stock.previousStock
    const stock = this.stock.totalSale + this.stock.currentStock
    this.stock.weightLoss = ((production - stock) / production) * 100
  }

  update() {
    this.stock.updatedBy = this.sharedService.userId
    this.rubberStockService.updateRubberStock(this.stock)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Stock successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.dialogRef.close()
        }
      )
  }

  back() {
    this.dialogRef.close()
  }
}
