import { Component } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { RoomresultComponent } from '../roomresult/roomresult.component';
import { RoomsearchComponent } from '../roomsearch/roomsearch.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';


@Component({
  selector: 'app-rooms',
  imports: [PaginationComponent,
     RoomresultComponent,
      RoomsearchComponent,
       CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})

export class RoomsComponent {


  rooms: any[] = [];
  filteredRooms: any[] = [];
  roomTypes: string[] = [];
  selectedRoomType: string = '';
  currentPage: number = 1;
  roomsPerPage: number = 8;
  error: any = null;

  constructor(private apiService: ApiService) {}
  
  ngOnInit():void{

    this.fetchRooms();
    this.fetchRoomTypes();

  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  // Fetch all rooms from the API
  fetchRooms() {
    this.apiService.getAllRooms().subscribe({
      next: (response: any) => {
        this.rooms = response.rooms;
        this.filteredRooms = response.rooms;
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Error fetching rooms:' + err);
      },
    });
  }

  // Fetch room types from the API
  fetchRoomTypes() {
    this.apiService.getRoomTypes().subscribe({
      next: (types: string[]) => {
        this.roomTypes = types;
      },
      error: (err) => {
        this.showError(
          err?.error?.message || 'Error fetching room Types:' + err
        );
      },
    });
  }


    // Handle the search result passed from RoomsearchComponent
    handleSearchResult(results: any[]) {
      this.rooms = results;
      this.filteredRooms = results;
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
    this.currentPage = 1;
  }


  // Pagination logic
  get indexOfLastRoom() {
    return this.currentPage * this.roomsPerPage;
  }

  get indexOfFirstRoom() {
    return this.indexOfLastRoom - this.roomsPerPage;
  }

  get currentRooms() {
    return this.filteredRooms.slice(
      this.indexOfFirstRoom,
      this.indexOfLastRoom
    );
  }

  // Pagination function to change page
  paginate(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  
}
