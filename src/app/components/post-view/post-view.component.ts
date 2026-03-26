import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IPost } from '../../share/post.interface';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent implements OnInit {
  _activatedRoute = inject(ActivatedRoute);
  private _postData = toSignal(this._activatedRoute.data.pipe());

  post = computed(() => this._postData()?.['post']);

  ngOnInit(): void {
    console.log('post view');
    console.log(this.post());
  }
}
