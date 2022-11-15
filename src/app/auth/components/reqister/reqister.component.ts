import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestInterface } from '../../types/registerRequest.interface';

@Component({
  selector: 'auth-reqister',
  templateUrl: './reqister.component.html',
  styleUrls: ['./reqister.component.scss']
})
export class RegisterComponent {
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}

  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  onSubmit(): void {
    this.authService.register(<RegisterRequestInterface>this.form.value).subscribe({
      next: (currentUser) => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/')
      },
      error: (err: HttpErrorResponse) => {
        console.log('error:', err.error)
        this.errorMessage = err.error.join(', ')
      }
    });
  }

}
