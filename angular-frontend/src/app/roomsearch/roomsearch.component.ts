import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'


@Component({
  selector: 'app-roomsearch',
  imports: [CommonModule, FormsModule],
  templateUrl: './roomsearch.component.html',
  styleUrl: './roomsearch.component.css'
})

export class RoomsearchComponent implements OnInit {

  @Output() searchResults = new EventEmitter<any[]>(); // Emit the results

  startDate: string | null = null; // Store date as string
  endDate: string | null = null; // Store date as string
  roomType: string = ''; // Selected room type
  roomTypes: string[] = []; // Available room types
  error: any = null;

  minDate: string = new Date().toISOString().split('T')[0]; // Current date in 'yyyy-MM-dd' format

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchRoomTypes();
  }

  fetchRoomTypes() {
    this.apiService.getRoomTypes().subscribe({
      next: (types: any) => {
        this.roomTypes = types;
      },
      error: (err:any) => {
        this.showError(
          err?.error?.message || 'Error Fetching Room Types: ' + err
        );
        console.error(err);
      },
    });
  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  handleSearch() {
    if (!this.startDate || !this.endDate || !this.roomType) {
      this.showError('Please select all fields');
      return;
    }

    // Convert startDate and endDate from string to Date
    const formattedStartDate = new Date(this.startDate);
    const formattedEndDate = new Date(this.endDate);

    // Check if the dates are valid
    if (
      isNaN(formattedStartDate.getTime()) ||
      isNaN(formattedEndDate.getTime())
    ) {
      this.showError('Invalid date format');
      return;
    }

    // Convert the Date objects to 'yyyy-MM-dd' format
    const startDateStr = formattedStartDate.toLocaleDateString('en-CA'); // 'yyyy-MM-dd'
    const endDateStr = formattedEndDate.toLocaleDateString('en-CA'); // 'yyyy-MM-dd'

    console.log('formattedStartDate: ' + startDateStr);
    console.log('formattedEndDate: ' + endDateStr);
    console.log('roomType: ' + this.roomType);

    this.apiService
      .getAvailableRooms(startDateStr, endDateStr, this.roomType)
      .subscribe({
        next: (resp: any) => {
          if (resp.rooms.length === 0) {
            this.showError(
              'Room type not currently available for the selected date'
            );
            return;
          }
          this.searchResults.emit(resp.rooms); // Emit the room data
          this.error = ''; // Clear any previous errors
        },
        error: (error:any) => {
          this.showError(error?.error?.message || error.message);
        },
      });
  }

}
