import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { NavBarComponent, HomeComponent, BlogEditorComponent, BlogCardComponent, BlogComponent, MyBlogComponent, ViewBlogsComponent } from './components';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { ExcerptPipe } from './customPipes/excerpt.pipe';
import { SlugPipe } from './customPipes/slug.pipe';
import { ToastrModule } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from './guards/auth.guard';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    BlogEditorComponent,
    ExcerptPipe,
    SlugPipe,
    BlogCardComponent,
    BlogComponent,
    MyBlogComponent,
    ViewBlogsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    CKEditorModule,
    NgMaterialModule,
    FlexLayoutModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'view-blogs', component: ViewBlogsComponent},
      { path: 'my-blog', component: MyBlogComponent },
      { path: 'addpost', component: BlogEditorComponent, canActivate: [AuthGuard] },
      { path: 'blog/:id/:slug', component: BlogComponent },
      { path: 'editpost/:id', component: BlogEditorComponent },
      { path: '**', component: HomeComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
