import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private static BASE_URL = 'http://localhost:7070/api';
  private static ENCRYPTION_KEY = 'dennis-encryp-key';

  constructor(private http: HttpClient) {}

  //Encrypt and save token or role to localstorage
  encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(
      value,
      ApiService.ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encryptedValue);
  }

  // Retrieve from localStorage and decrypt
  private getFromStorageAndDecrypt(key: string): string | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(
        encryptedValue,
        ApiService.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  
  //clear authentication data
  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }




  // AUTH API METHODS
  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }




  // USERS API METHODS
  myProfile(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/account`, {
      headers: this.getHeader(),
    });
  }

  myBookings(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/bookings`, {
      headers: this.getHeader(),
    });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/users/delete`, {
      headers: this.getHeader(),
    });
  }





  // ROOMS API METHODS
  addRoom(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/rooms/add`, formData, {
      headers: this.getHeader(),
    });
  }

  updateRoom(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/rooms/update`, formData, {
      headers: this.getHeader(),
    });
  }

  getAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    roomType: string
  ): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/rooms/available`, {
      params: { checkInDate, checkOutDate, roomType },
    });
  }

  getRoomTypes(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/rooms/types`);
  }

  getAllRooms(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/rooms/all`);
  }

  getRoomById(roomId: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/rooms/${roomId}`);
  }

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader(),
    });
  }




  // BOOKINGS API METHODS
  bookRoom(booking: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/bookings`, booking, {
      headers: this.getHeader(),
    });
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/bookings/all`, {
      headers: this.getHeader(),
    });
  }

  updateBooking(booking: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/bookings/update`, booking, {
      headers: this.getHeader(),
    });
  }

  getBookingByReference(bookingCode: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/bookings/${bookingCode}`);
  }





  // PAYMENT API METHODS
  proceedForPayment(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/payments/pay`, body, {
      headers: this.getHeader(),
    });
  }

  updateBookingPayment(body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/payments/update`, body, {
      headers: this.getHeader(),
    });
  }



  
  

  // AUTHENTICATION CHECKER
  logout(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'ADMIN';
  }

  isCustomer(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'CUSTOMER';
  }

}
