import { Component, OnInit } from '@angular/core';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-blog',
  templateUrl: './my-blog.component.html',
  styleUrls: ['./my-blog.component.scss']
})
export class MyBlogComponent implements OnInit {
  appUser: AppUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

}
