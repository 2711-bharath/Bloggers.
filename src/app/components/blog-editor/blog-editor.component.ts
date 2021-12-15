import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Post } from 'src/app/models/posts';
import { DatePipe } from '@angular/common';
import { BlogService } from 'src/app/services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
  providers: [DatePipe]
})
export class BlogEditorComponent implements OnInit, OnDestroy {

  public Editor = ClassicEditor;
  ckeConfig: any;
  postData = new Post();
  formTitle = 'Add';
  postId = '';
  appUser: AppUser;
  imageData : any;
  selectedImage : any;
  isAdding: boolean = false;
  imageError: boolean = false;
  private unsubscribe$ = new Subject<void>();

  setEditorConfig(): void {
    this.ckeConfig = {
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ckheading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ckheading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ckheading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ckheading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ckheading_heading4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ckheading_heading5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ckheading_heading6' },
          { model: 'Formatted', view: 'pre', title: 'Formatted' },
        ]
      }
    };
  }

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private blogService: BlogService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private storage:AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.setEditorConfig();
    if (this.route.snapshot.params['id']) {
      this.postId = this.route.snapshot.paramMap.get('id');
    }
    if (this.postId) {
      this.formTitle = 'Edit';
      this.blogService.getPostbyId(this.postId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.setPostFormData(result);
      });
    }
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.selectedImage = (event.target as HTMLInputElement).files![0];
    const allowedFileType = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedFileType.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as String;
      }
      reader.readAsDataURL(file);
    }
  }


  setPostFormData(postFormData) {
    this.postData.title = postFormData.title;
    this.postData.content = postFormData.content;
  }

  saveBlogPost() {
    if(this.selectedImage && this.selectedImage.name) {
      var filePath = `Posts/${this.selectedImage.name}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.isAdding = true;
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
            this.postData.imageUrl=url;
            if (this.postId) {
              this.blogService.updatePost(this.postId, this.postData).then(() => {
                this.toastr.success('Post Updated Successfully');
                this.router.navigate(['/']);
              });
            } else {
              this.postData.author = this.appUser.name;
              this.postData.email = this.appUser.email; 
              this.postData.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
              this.blogService.createPost(this.postData).then(() => {
                this.toastr.success('Post Added Successfully');
                this.router.navigate(['/']);
              });
            }
          })
      })).subscribe();
    } else {
      this.imageError = true;
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
