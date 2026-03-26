import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IPost } from '../../share/post.interface';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {
  post = signal<IPost | null>(null);
}
