import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-roomresult',
  imports: [CommonModule],
  templateUrl: './roomresult.component.html',
  styleUrl: './roomresult.component.css'
})
export class RoomresultComponent {


  @Input() roomSearchResults: any[] = []; // Input property for room results
  isAdmin: boolean;

  constructor(private router: Router, private apiService: ApiService) {
    // Get the current user's admin status
    this.isAdmin = this.apiService.isAdmin();
  }

  // Method to navigate to the edit room page (for admins)
  navigateToEditRoom(roomId: string) {
    this.router.navigate([`/admin/edit-room/${roomId}`]);
  }

  // Method to navigate to the room details page (for users)
  navigateToRoomDetails(roomId: string) {
    this.router.navigate([`/room-details/${roomId}`]);
  }

}
