import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AnnotationService } from '../../services/annotation.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationListComponent {
  private _postService = inject(PostService);
  private _annotationService = inject(AnnotationService);

  postId = this._postService.currentPostId;

  annotations = computed(() => {
    return this._annotationService
      .annotations()
      .filter((annotation) => annotation.postId === this.postId());
  });
}
