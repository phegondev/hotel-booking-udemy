import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-adminhome',
  imports: [CommonModule],
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.css'
})
export class AdminhomeComponent {

  adminName: string = '';
  error: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAdminName();
  }

  // Fetch the admin's profile name
  fetchAdminName(): void {
    this.apiService.myProfile().subscribe({
      next: (resp: any) => {
        this.adminName = resp.user.firstName;
      },
      error: (error) => {
        this.error = error.message;
        console.error('Error fetching admin name:', error);
      },
    });
  }

  // Navigate to Manage Rooms
  navigateToManageRooms(): void {
    this.router.navigate(['/admin/manage-rooms']);
  }

  // Navigate to Manage Bookings
  navigateToManageBookings(): void {
    this.router.navigate(['/admin/manage-bookings']);
  }

}
