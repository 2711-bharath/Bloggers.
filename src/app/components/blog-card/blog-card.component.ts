import { Component, Input, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/posts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent implements OnInit, OnDestroy {
  @Input() show: string;
  blogPost: Post[] = [];
  private unsubscribe$ = new Subject<void>();
  appUser: AppUser;

  constructor(
    private blogService: BlogService,
    private toastr: ToastrService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
    this.getBlogPosts();
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  getBlogPosts() {
    this.blogService.getAllPosts().pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => {
      if(this.appUser && this.show != 'all') {
        this.blogPost = res.filter(post => post.email == this.appUser.email);
      } else {
        this.blogPost = res;
      }
    })
  }

  delete(postId: string) {
    if (confirm('Are you sure')) {
      this.blogService.deletePost(postId).then(
        () => {
          this.toastr.success('Post deleted Successfully');
        }
      );
    }
  }

}
