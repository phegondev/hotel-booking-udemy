import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor( private apiService: ApiService, private router: Router){}
  
  formData: any = {

    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  }

  error: any = null;

  handleSubmit(){
    if (
      !this.formData.email ||
      !this.formData.firstName ||
      !this.formData.lastName ||
      !this.formData.phoneNumber ||
      !this.formData.password 
    ) {
      this.showError('Please all fields are required');
      return
    }

    this.apiService.registerUser(this.formData).subscribe({
      next:(res: any) => {
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.showError(err?.error?.message || err.message || 'Unable to Register a user: ' + err)
      }
    });
  }

  showError(msg: string){
    this.error = msg;
    setTimeout(()=> {
      this.error = null
    }, 4000);
  }

}
