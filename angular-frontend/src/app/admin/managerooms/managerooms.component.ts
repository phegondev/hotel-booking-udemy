import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomresultComponent } from '../../roomresult/roomresult.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-managerooms',
  imports: [CommonModule, FormsModule, RoomresultComponent, PaginationComponent],
  templateUrl: './managerooms.component.html',
  styleUrl: './managerooms.component.css'
})
export class ManageroomsComponent {

  rooms: any[] = [];
  filteredRooms: any[] = [];
  roomTypes: string[] = [];
  selectedRoomType: string = '';
  currentPage: number = 1;
  roomsPerPage: number = 6;
  error:any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRooms();
    this.fetchRoomTypes();
  }



  showError(msg: string) {
    this.error = msg;
    setTimeout(() => {
      this.error = "";
    }, 4000);
  }
  
  // Fetch all rooms from the API
  fetchRooms() {
    this.apiService.getAllRooms().subscribe({
      next: (response: any) => {
        this.rooms = response.rooms;
        this.filteredRooms = response.rooms;
      },
      error: (error) => {
        this.showError('Error fetching rooms:' + error);
      }
  });
  }

  // Fetch room types from the API
  fetchRoomTypes() {
    this.apiService.getRoomTypes().subscribe({
      next: (types: string[]) => {
        this.roomTypes = types;
      },
      error: (error) => {
        this.showError('Error fetching room types: ' + error);
      },
    });
  }

  // Handle changes to room type filter
  handleRoomTypeChange(event: any) {
    const selectedType = event.target.value;
    this.selectedRoomType = selectedType;
    this.filterRooms(selectedType);
  }

  // Filter rooms by type
  filterRooms(type: string) {
    if (type === '') {
      this.filteredRooms = this.rooms;
    } else {
      this.filteredRooms = this.rooms.filter((room) => room.type === type);
    }
    this.currentPage = 1; // Reset to first page when filter changes
  }

  // Pagination logic
  get indexOfLastRoom() {
    return this.currentPage * this.roomsPerPage;
  }

  get indexOfFirstRoom() {
    return this.indexOfLastRoom - this.roomsPerPage;
  }

  get currentRooms() {
    return this.filteredRooms.slice(this.indexOfFirstRoom, this.indexOfLastRoom);
  }

  // Pagination function to change page
  paginate(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  // Navigate to Add Room page
  navigateToAddRoom() {
    this.router.navigate(['/admin/add-room']);
  }
}
