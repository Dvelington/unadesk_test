import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IPost } from '../../share/post.interface';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  get posts(): IPost[] {
    return this._postService.getPosts();
  }

  constructor(private _postService: PostService) {}

  addPost(): void {
    console.log('add post');
  }
}
