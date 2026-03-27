import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import {
  AnnotationService,
  IAnotationItem,
} from '../../services/annotation.service';
import { PostService } from '../../services/post.service';
import { AnnotationEditComponent } from '../annotation-edit/annotation-edit.component';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.scss'],
  imports: [CommonModule, AnnotationEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationListComponent {
  private _postService = inject(PostService);
  private _annotationService = inject(AnnotationService);

  postId = this._postService.currentPostId;

  @ViewChild('dialog')
  dialog?: ElementRef<HTMLDialogElement>;

  annotations = computed(() => {
    return this._annotationService
      .annotations()
      .filter((annotation) => annotation.postId === this.postId());
  });

  openEditor(annotation: IAnotationItem) {
    this._annotationService.setEditedAnnotationId(annotation.postId);
    this.dialog?.nativeElement.showModal();
  }

  closeDialog() {
    this._annotationService.setEditedAnnotationId(null);
    this.dialog?.nativeElement.close();
  }

  removeAnnotation(event: PointerEvent, annotation: IAnotationItem) {
    event.preventDefault();
    event.stopPropagation();
    this._annotationService.removeAnnotation(annotation);
  }
}
