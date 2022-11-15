import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  isLoggedInSub: Subscription | undefined;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedInSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if(isLoggedIn){
        this.router.navigateByUrl('/boards')
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedInSub?.unsubscribe()
  }

}
