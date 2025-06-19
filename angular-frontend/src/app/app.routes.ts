import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { GuardService } from './service/guard.service';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomdetailsComponent } from './roomdetails/roomdetails.component';
import { FindbookingComponent } from './findbooking/findbooking.component';
import { PaymentpageComponent } from './payment/paymentpage/paymentpage.component';
import { PaymentsuccessComponent } from './payment/paymentsuccess/paymentsuccess.component';
import { PaymentfailureComponent } from './payment/paymentfailure/paymentfailure.component';
import { AdminhomeComponent } from './admin/adminhome/adminhome.component';
import { ManageroomsComponent } from './admin/managerooms/managerooms.component';
import { AddroomComponent } from './admin/addroom/addroom.component';
import { EditroomComponent } from './admin/editroom/editroom.component';
import { ManagebookingsComponent } from './admin/managebookings/managebookings.component';
import { UpdatebookingComponent } from './admin/updatebooking/updatebooking.component';
import { AdminregisterComponent } from './admin/adminregister/adminregister.component';




export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent},

    {path: 'rooms', component: RoomsComponent},
    {path: 'room-details/:id', component: RoomdetailsComponent, canActivate: [GuardService]},
    {path: 'find-booking', component: FindbookingComponent},


    {path: 'profile', component: ProfileComponent, canActivate: [GuardService]},
    {path: 'edit-profile', component: EditprofileComponent, canActivate: [GuardService]},

    //PAYMENTS ROUTES
    {path: 'payment/:bookingReference/:amount', component: PaymentpageComponent, canActivate: [GuardService]},
    {path: 'payment-success/:bookingReference', component: PaymentsuccessComponent, canActivate: [GuardService]},
    {path: 'payment-failue/:bookingReference', component: PaymentfailureComponent, canActivate: [GuardService]},

    //ADMIN ROUTES OR PAGES

    {path: 'admin', component: AdminhomeComponent, canActivate: [GuardService], data: {requiresAdmin: true}},
    {path: 'admin/manage-rooms', component: ManageroomsComponent, canActivate: [GuardService], data: {requiresAdmin: true}},
    {path: 'admin/add-room', component: AddroomComponent, canActivate: [GuardService], data: {requiresAdmin: true}},
    {path: 'admin/edit-room/:id', component: EditroomComponent, canActivate: [GuardService], data: {requiresAdmin: true}},

    {path: 'admin/manage-bookings', component: ManagebookingsComponent, canActivate: [GuardService], data: {requiresAdmin: true}},
    {path: 'admin/edit-booking/:bookingCode', component: UpdatebookingComponent, canActivate: [GuardService], data: {requiresAdmin: true}},

    {path: 'admin/admin-register', component: AdminregisterComponent, canActivate: [GuardService], data: {requiresAdmin: true} },

    {path: '**', redirectTo: 'home'}
];
