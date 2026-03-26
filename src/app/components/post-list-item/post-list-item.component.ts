import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { IPost } from '../../share/post.interface';
import { PostService } from '../../services/post.service';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss'],
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListItemComponent {
  private _postService = inject(PostService);
  private _location = inject(Location);

  post = input.required<IPost>();

  removePost() {
    if (!this.post()) return;
    this._postService.removePost(this.post().id);
  }
}
