import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IPost } from '../../share/post.interface';
import { Router, RouterLink } from '@angular/router';
import { PostListItemComponent } from '../post-list-item/post-list-item.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PostListItemComponent],
})
export class PostListComponent {
  _postService = inject(PostService);
  _router = inject(Router);

  get posts(): IPost[] {
    return this._postService.getPosts();
  }

  addPost(): void {
    console.log('add post');
  }

  goToPost(id: number) {}
}
