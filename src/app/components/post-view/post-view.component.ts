import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IPost } from '../../share/post.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {
  private _postService = inject(PostService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _postData = toSignal(this._activatedRoute.data.pipe());

  post = computed(() => this._postData()?.['post']);

  isPostExist = computed(() => {
    const curretPost = this.post();
    return (
      this._postService
        .getPosts()
        .findIndex((post) => post.id === curretPost?.id) >= 0
    );
  });

  constructor() {
    effect(() => {
      console.log('isPostExist', this.isPostExist());
      if (!this.isPostExist()) {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
      }
    });
  }
}
