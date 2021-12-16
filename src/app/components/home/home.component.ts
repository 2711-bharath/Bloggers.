import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/appuser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  appUser: AppUser;

  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  openLogin(): void {
    if (this.appUser) {
      this.route.navigateByUrl('/addpost');
    } else {
      this.authService.login();
    }
  }

}
