import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, private apiService: ApiService){}

  get isAuthemticated():boolean{
    return this.apiService.isAuthenticated();
  }

  get isCustomer():boolean{
    return this.apiService.isCustomer();
  }

  get isAdmin():boolean{
    return this.apiService.isAdmin();
  }

  handleLogout(): void{
    const isLogout = window.confirm("Are you sure you want to logout? ")
    if (isLogout) {
      this.apiService.logout();
      this.router.navigate(['/home'])
    }
  }

}
