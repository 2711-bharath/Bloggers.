import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/posts';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  postData: Post = new Post();
  postId;
  private unsubscribe$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.postId = this.route.snapshot.paramMap.get('id');
    }
    this.blogService.getPostbyId(this.postId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: Post) => {
        this.postData = res;
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
