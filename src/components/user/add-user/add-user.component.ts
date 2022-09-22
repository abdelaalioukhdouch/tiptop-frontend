import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { AdminService } from 'src/services/admin.service';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private crudService: AdminService
  ) { 
    this.userForm = this.formBuilder.group({
      name: [''],
      email: [''],
    })
  }
  ngOnInit() { }
  onSubmit(): any {
    this.crudService.AddUser(this.userForm.value)
    .subscribe(() => {
        console.log('User added successfully!')
        this.ngZone.run(() => this.router.navigateByUrl('/users-list'))
      }, (err) => {
        console.log(err);
    });
  }
}