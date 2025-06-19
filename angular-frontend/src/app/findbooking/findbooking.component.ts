import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-findbooking',
  imports: [CommonModule, FormsModule],
  templateUrl: './findbooking.component.html',
  styleUrl: './findbooking.component.css'
})
export class FindbookingComponent {

  constructor(private apiService: ApiService){}
  
  confirmationCode: string = '';
  bookingDetails: any = null;
  error: any = null;

  handleSearch(){
    if (!this.confirmationCode.trim()) {
      this.showError("Please enter the booking confirmation Code");
      return;
    }

    this.apiService.getBookingByReference(this.confirmationCode).subscribe({
      next: (res) => {
        this.bookingDetails = res.booking;
      },
      error: (err) => {
        this.showError(err?.error.message || "Error fetching booking details")
      },
    })
  }

  showError(err: any): void{
    console.log(err)
    this.error = err;
    setTimeout(() => {
      this.error = ''
    }, 4000)
  }

}
