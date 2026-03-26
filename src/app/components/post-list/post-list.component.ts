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

// [
//   { id: 1774534400916, title: 'sdfasdf', body: 'asdfasdf' },
//   { id: 1774534392654, title: 'sdfasdf', body: 'sadfasdf' },
//   { id: 1774534356385, title: 'sadfasdf', body: 'sdfsdf' },
//   { id: 1774534353179, title: 'sfdgfg', body: 'sfdgsdfg' },
//   { id: 1774534350661, title: 'sgs', body: 'sdfgsdfg' },
//   { id: 1774534347882, title: 'sdfgsdfg5', body: '5g5g' },
//   { id: 1774534345421, title: 'sfg', body: 'gsdfg' },
//   { id: 1774534343367, title: 'asdg', body: 'asd' },
//   { id: 1774534341612, title: 'asdg', body: '45g5' },
//   { id: 1774534339314, title: 'asdg', body: '4g' },
//   { id: 1774534336882, title: 'g4g', body: 'gagd' },
//   { id: 1774534334209, title: 'g4', body: 'g' },
//   { id: 1774534332499, title: 'sdfg', body: 'gfs' },
//   { id: 1774534330163, title: 'gfg', body: 'fgf' },
//   { id: 1774534328283, title: 'sdfg', body: 'sdfg' },
//   { id: 1774534303083, title: 'sdfg', body: 'sdfg' },
//   { id: 1774534301343, title: 'sdfg', body: 'sdfg' },
//   { id: 1774534298558, title: 'sdfg', body: 'sdfg' },
//   { id: 1774534296711, title: 'sdfg', body: 'sdfg' },
//   { id: 1774534295029, title: 'sdfg', body: 'sdfg' },
//   { id: 1774534293167, title: 'sdfg', body: 'dsfg' },
//   { id: 1774534285742, title: 's', body: 'f' },
//   { id: 1774534188716, title: 'sdafasdf', body: 'sadfasdf' },
//   { id: 1774534093145, title: 'sdf3', body: 'sdfsdfsdfsdf4444' },
// ];
