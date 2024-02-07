import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  type:string = "password";
  isText:boolean = false;
  eyeIcon:string = "fa-eye-slash";
  signupForm!: FormGroup;

  constructor(private formBuilder:FormBuilder, private authService:AuthService,private userService: UserService, private router:Router,private messageService:MessageService){}

  ngOnInit() : void{
    this.signupForm = this.formBuilder.group({
      name: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      confirmPassword: ['',Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText? this.type = "text" : this.type = "password";
  }

  onSignup(){
    if(this.signupForm.valid){
      this.authService.signUp(this.signupForm.value).subscribe({
        next:(res => {
          this.messageService.add({severity: 'success', summary:  'Success', detail: 'Registeration Successfull' });
          this.signupForm.reset();
          this.router.navigate(['login']);
        }),
        error:(err => {
          this.messageService.add({severity: 'error', summary:  `${err}`, detail: 'Some Error Occured' });
        })
      })
    }
    else{
      this.userService.validateAllFormFields(this.signupForm);
      this.messageService.add({severity: 'error', summary:  'Invalid Form', detail: 'Validations Failed' });
    }
  }

  

}
