import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-managebookings',
  imports: [PaginationComponent, CommonModule, FormsModule],
  templateUrl: './managebookings.component.html',
  styleUrl: './managebookings.component.css'
})
export class ManagebookingsComponent {

  
  bookings: any[] = []; // Store all bookings
  filteredBookings: any[] = []; // Store filtered bookings based on search term
  searchTerm: string = ''; // Search term for filtering bookings
  currentPage: number = 1; // Current page for pagination
  bookingsPerPage: number = 12; // Number of bookings per page
  error:any =null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  // Fetch bookings data from the API
  fetchBookings(): void {
    this.apiService.getAllBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.bookings || []; // Set bookings or an empty array if no data
        this.filteredBookings = this.bookings; // Initially, filtered bookings are the same as all bookings
      },
      error: (error) => {
        this.error('Error fetching bookings:', error.message);
      }
  });
  }

  // Update filtered bookings based on the search term
  handleSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredBookings = this.bookings; // If no search term, show all bookings
    } else {
      this.filteredBookings = this.bookings.filter((booking) =>
        booking.bookingReference?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.currentPage = 1; // Reset to the first page when search term changes
  }

  // Handle page changes for pagination (this is the handler for the paginate event)
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  // Get bookings for the current page
  get currentBookings(): any[] {
    const indexOfLastBooking = this.currentPage * this.bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - this.bookingsPerPage;
    return this.filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  }

  // Navigate to the booking management page
  manageBooking(bookingReference: string): void {
    this.router.navigate([`/admin/edit-booking/${bookingReference}`]);
  }


}
