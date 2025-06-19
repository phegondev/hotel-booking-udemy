import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-adminregister',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './adminregister.component.html',
  styleUrl: './adminregister.component.css'
})
export class AdminregisterComponent {

  constructor(private apiService: ApiService, private router: Router) {}

  formData: any = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
  };

  message: string | null = null;

  handleSubmit() {
    if (
      !this.formData.email ||
      !this.formData.firstName ||
      !this.formData.lastName ||
      !this.formData.phoneNumber ||
      !this.formData.password ||
      !this.formData.role
    ) {
      this.showError('All fields are required');
      return;
    }

    this.apiService.registerUser(this.formData).subscribe({
      next: (res) => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.showError(
          err?.error?.message ||
            err.message ||
            'Unable To Register a user: ' + err
        );
      },
    });
  }

  showError(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = null;
    }, 4000);
  }

}
