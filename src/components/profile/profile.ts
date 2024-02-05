import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { User } from 'src/models/User';
import { AuthService } from 'src/services/auth.service';
import { ProfileService } from 'src/services/profile.service';
import { HttpClient } from '@angular/common/http';
import { AdminService } from 'src/services/admin.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  currentUser: any;
    user: User = {
      name: '',
      firstName: '',
      address: '',
      email: '',
      password: '' // Be cautious with handling passwords
      ,
      id_user: undefined,
      role: undefined,
      confirm_password: undefined
    };
  

    isEditMode = false;
    userIsAuthenticated = false;
    userRole: string;
    name: string;
    firstname: string;
    address: string;
    email: string;
    password: string;

    private authListenerSubs: Subscription;
    profile: any;
    username: string
    profileisSet = false
    userIsAdmin = false;


    constructor(private authService: AuthService, private adminService: AdminService, private profileService: ProfileService,private httpClient: HttpClient) { }
  

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    }

    // Method to handle form submission
    saveUser() {
      // Construct the user data object from the form fields
      const updatedUser = {
        name: this.name,
        firstname: this.firstname,
        address: this.address,
        email: this.email,
        password: this.password // Be cautious with handling passwords
      };
    
      // Call your service to update the user
      console.log('User ID:', this.currentUser?.user?._id); // Add this before updateUser call

      this.adminService.updateUser(this.currentUser?.user?._id, updatedUser).subscribe(
        response => {
          console.log('User updated successfully', response);
          this.toggleEditMode(); // Optionally, toggle off edit mode
          // You might want to update currentUser with the new details
          // Or perform other actions like refreshing the user list
        },
        error => {
          console.error('Error updating user:', error);
          // Handle errors here, such as displaying a notification
        }
      );
    }
    

    ngOnInit() {
      this.currentUser = this.authService.getUserData();
      //this.userRole = this.authService.getUserRole();

      this.profileisSet = this.profileService.getIsProfileSet()
      this.userIsAuthenticated = this.authService.getIsAuth();
      if (this.userIsAuthenticated) {
        this.getProfile()
      }
  
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          if (this.userIsAuthenticated) {
            this.getProfile()
          }
        });
     this.userRole = this.currentUser?.user?.role;
     this.name = this.currentUser?.user?.name;
     this.firstname = this.currentUser?.user?.firstname;
     this.address = this.currentUser?.user?.address;
     this.email = this.currentUser?.user?.email;


        console.log('test', this.userRole)
    }

    getProfile() {
      this.profileService.getProfileByCreatorId().subscribe(prof => {
        this.profileisSet = true
        this.username = prof.profile.username
        this.userRole = prof.profile.role
        this.name = prof.profile.name
        this.firstname = prof.profile.firstname

        this.profile = {
          id: prof.profile._id,
          username: prof.profile.username,
          bio: prof.profile.bio,
          imagePath: prof.profile.imagePath,
          creator: prof.profile.creator,
          role: prof.profile.role,
          name: prof.profile.name
        };
        this.userIsAdmin = this.profile.role === 'admin';

      },
        err => {
          this.profileisSet = false
          this.username = null
        })
  
    }
  }

  