
import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor( private apiService: ApiService, private router: Router){}
  
  formData: any = {

    email: '',
    password: ''

  }
  error: any = null;

  async handleSubmit(){

    console.log("hanlde submit is called for login")

    if (!this.formData.email || !this.formData.password) {
      this.showError("Please fill all the fields correctly")
      return
    }

    this.apiService.loginUser(this.formData).subscribe({
      next: (res:any) => {
        if (res.status === 200) {
          this.apiService.encryptAndSaveToStorage('token', res.token);
          this.apiService.encryptAndSaveToStorage('role', res.role);
          this.router.navigate(['/home'])
        }
      },
      error: (err: any) => {
        this.showError(err?.error?.message || err.message || 'Unable To Login: ' + err)
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
