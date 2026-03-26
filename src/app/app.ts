import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostListComponent } from './components';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { AnnotationListComponent } from './components/annotation-list/annotation-list.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    PostListComponent,
    PostEditComponent,
    AnnotationListComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'unadesk_test';
}
