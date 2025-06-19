import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() roomPerPage: number = 10; // Number of rooms per page
  @Input() totalRooms: number = 0; // Total number of rooms
  @Input() currentPage: number = 1; // Current page
  @Output() paginate: EventEmitter<number> = new EventEmitter<number>(); // Emit page number

  // Method to generate the page numbers
  get pageNumbers(): number[] {
    const pageCount = Math.ceil(this.totalRooms / this.roomPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  // Method to handle page change
  onPageChange(pageNumber: number): void {
    this.paginate.emit(pageNumber); // Emit the page number to parent component
  }

}
