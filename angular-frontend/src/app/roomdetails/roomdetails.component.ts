import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-roomdetails',
  imports: [CommonModule, FormsModule],
  templateUrl: './roomdetails.component.html',
  styleUrl: './roomdetails.component.css'
})

export class RoomdetailsComponent {

  constructor(private apiService: ApiService,
    private route:ActivatedRoute,
    private router: Router
  ){}

  room: any = null;
  roomId: any = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalPrice: number = 0;
  totalDaysToStay: number = 0;
  showDatePicker:boolean = false;
  showBookingPreview: boolean = false;
  message: any = null;
  error: any = null;

  //minimum date for the check-in-date
  minDate: string = new Date().toISOString().split('T')[0] //get the current date in this format "yyy-mm-dd"
  
  ngOnInit():void{
    this.roomId = this.route.snapshot.paramMap.get('id');
    
    if (this.roomId) {
      this.fetchRoomDetails(this.roomId)
    }
  }

  fetchRoomDetails(roomId: string): void{
    this.apiService.getRoomById(roomId).subscribe({
      next:(res: any) =>{
        this.room = res.room
      },
      error: (err) => {
        this.showError(err?.error?.message || "Unable to fetch room details")
      }
    })
  }

  showError(err: any): void{
    console.log(err)
    this.error = err;
    setTimeout(() => {
      this.error = ''
    }, 5000)
  }

  calculateTotalPrice():number {
    if (!this.checkInDate || !this.checkOutDate) return 0;

    //convert it date
    const checkIn = new Date(this.checkInDate)
    const checkOut = new Date(this.checkOutDate)

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      this.showError("Invalid Date selected")
      return 0;
    }

    const oneDay = 24 * 60 * 60 * 1000; //milisec
    const totalDays = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay)); //differenc in days

    this.totalDaysToStay = totalDays;

    return this.room?.pricePerNight * totalDays || 0;
  }

  handleConfirmation(): void{
    if(!this.checkInDate || !this.checkOutDate){
      this.showError("Please select both check-in and check-out dates");
      return;
    }

    this.totalPrice = this.calculateTotalPrice();
    this.showBookingPreview = true;
  }

  acceptBooking():void{
    if(!this.room) return

    //Ensure the check in sarte and check out date are well formatted
    const formattedCheckInDate = this.checkInDate? new Date(this.checkInDate).toLocaleDateString('en-CA'):'';
    const formattedCheckOutDate = this.checkOutDate? new Date(this.checkOutDate).toLocaleDateString('en-CA'): '';

    console.log("check in date is: "+ formattedCheckInDate);
    console.log("check out date is: " + formattedCheckOutDate);

    //we are building our body object
    const booking = {
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
      roomId: this.roomId
    };

    this.apiService.bookRoom(booking).subscribe({
      next: (res: any) =>{
        if (res.status === 200) {
          this.message = "Your Booking is Successful. An Email of your booking details and the payment link has been sesnt to you";
          setTimeout(()=>{
            this.message = null;
            this.router.navigate(['/rooms'])
          }, 8000)
          
        }
      },
      error:(err) =>{
        this.showError(err?.error?.message || err?. message || "Unable to make a booking")
      }
    })
  }

  cancelBookingPreview():void{
    this.showBookingPreview = false
  }

  get isLoading():boolean{
    return !this.room
  }

}

