import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-editroom',
  imports: [CommonModule, FormsModule],
  templateUrl: './editroom.component.html',
  styleUrl: './editroom.component.css'
})
export class EditroomComponent {


  roomDetails = {
    roomNumber: '',
    type: '',
    pricePerNight: '',
    capacity: '',
    description: '',
    imageUrl: '',
  };

  id: string = '';
  roomTypes: string[] = []; // Store room types
  file: File | null = null;
  preview: string | null = null;
  error: string = '';
  success: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.fetchRoomDetails();
  }


  showError(msg: string) {
    this.error = msg;
    setTimeout(() => {
      this.error = "";
    }, 4000);
  }

  // Fetch room details and room types
  fetchRoomDetails() {
    this.apiService.getRoomById(this.id).subscribe({
      next: (roomResponse: any) => {
        this.roomDetails = {
          roomNumber: roomResponse.room.roomNumber,
          type: roomResponse.room.type,
          pricePerNight: roomResponse.room.pricePerNight,
          capacity: roomResponse.room.capacity,
          description: roomResponse.room.description,
          imageUrl: roomResponse.room.imageUrl,
        };
      },
      error: (error) => {
        this.showError(error?.error?.message || 'Error fetching room details');
      }
  });

    this.apiService.getRoomTypes().subscribe({
      next:(types: string[]) => {
        this.roomTypes = types;
      },
      error:(error) => {
        this.showError(error?.error?.message || 'Error fetching room types');
      }
  });
  }

  // Handle form input changes
  handleChange(event: Event): void {
    const { name, value } = <HTMLInputElement>event.target;
    this.roomDetails = { ...this.roomDetails, [name]: value };
  }

  // Handle file input change (image upload)
  handleFileChange(event: Event): void {
    const input = <HTMLInputElement>event.target;
    const selectedFile = input.files ? input.files[0] : null;
    if (selectedFile) {
      this.file = selectedFile;
      this.preview = URL.createObjectURL(selectedFile);
    } else {
      this.file = null;
      this.preview = null;
    }
  }

  // Update room details
  handleUpdate(): void {
    const formData = new FormData();
    formData.append('type', this.roomDetails.type);
    formData.append('pricePerNight', this.roomDetails.pricePerNight);
    formData.append('description', this.roomDetails.description);
    formData.append('capacity', this.roomDetails.capacity);
    formData.append('id', this.id);

    if (this.file) {
      formData.append('imageFile', this.file);
    }

    this.apiService.updateRoom(formData).subscribe({
      next:(response) => {
        this.success = 'Room updated successfully.';
        setTimeout(() => {
          this.router.navigate(['/admin/manage-rooms']);
        }, 3000);
      },
      error:(error) => {
        this.showError(error?.error?.message || 'Error updating room');
      }
  });
  }

  // Delete the room
  handleDelete(): void {
    if (window.confirm('Do you want to delete this room?')) {
      this.apiService.deleteRoom(this.id).subscribe({
        next:(response) => {
          this.success = 'Room deleted successfully.';
          setTimeout(() => {
            this.router.navigate(['/admin/manage-rooms']);
          }, 3000);
        },
        error:(error) => {
          this.showError(error?.error?.message || 'Error deleting room');
        }
    });
    }
  }
  
}
