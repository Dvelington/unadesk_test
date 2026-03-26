import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { IPost } from '../../share/post.interface';
import { Router, RouterLink } from '@angular/router';
import { PostListItemComponent } from '../post-list-item/post-list-item.component';
import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PostListItemComponent, SearchInputComponent],
})
export class PostListComponent {
  private _postService = inject(PostService);
  private _searchQuery = signal('');

  posts = computed(() => {
    return this._postService
      .getPosts()
      .filter((post) =>
        post.title
          .toLocaleLowerCase()
          .includes(this._searchQuery().toLocaleLowerCase()),
      );
  });

  search(value: string) {
    this._searchQuery.set(value);
  }
}
