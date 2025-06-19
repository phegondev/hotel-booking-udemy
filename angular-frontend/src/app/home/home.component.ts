import { Component } from '@angular/core';
import { RoomsearchComponent } from '../roomsearch/roomsearch.component';
import { RoomresultComponent } from '../roomresult/roomresult.component';

@Component({
  selector: 'app-home',
  imports: [RoomsearchComponent, RoomresultComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  searchResults: any[] = [] // store the result of the searched room

  // handle the result comming from the roomseearch component
  handleSearchResult(results: any[]){
    this.searchResults = results
  }

}
