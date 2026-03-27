import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';
import { filter, fromEvent } from 'rxjs';
import {
  AnnotationService,
  IAnotationItem,
} from '../../services/annotation.service';
import { AnnotationListComponent } from '../annotation-list/annotation-list.component';
import { AnnotationEditComponent } from '../annotation-edit/annotation-edit.component';
import { CommonModule } from '@angular/common';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  imports: [CommonModule, RouterLink, AnnotationEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent implements AfterViewInit {
  private _postService = inject(PostService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _drawerService = inject(DrawerService);
  private _postData = toSignal(this._activatedRoute.data.pipe());
  private _destoryRef = inject(DestroyRef);

  private _annotationService = inject(AnnotationService);
  private _suppressClick = signal(false);

  selection = this._annotationService.currentSelection;
  highlightedHtml = this._drawerService.highlightedHtml;

  hasSelection = computed(() => this.selection());

  dialogOpened = signal(false);

  @ViewChild('postBody')
  postBody?: ElementRef<HTMLDivElement>;

  @ViewChild('dialog')
  dialog?: ElementRef<HTMLDialogElement>;

  post = computed(() => this._postData()?.['post']);

  postAnnotations = computed(() => {
    return this._annotationService
      .annotations()
      .filter((annotation) => annotation.postId === this.post()?.id);
  });

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
      if (!this.isPostExist()) {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
      }
    });
    effect(() => {
      const currentPost = this.post();

      if (currentPost) {
        this._drawerService.renderHighlights(
          this.post().body,
          this.postAnnotations(),
        );
      }
    });
  }

  applyAnnotation(annotation: IAnotationItem) {
    const replacement = annotation.selection.text;
    const title = annotation.annotation.text;
    if (!this.postBody) return null;
    const walker = document.createTreeWalker(
      this.postBody?.nativeElement,
      NodeFilter.SHOW_TEXT,
      null,
    );

    let node: Text | null;

    while ((node = walker.nextNode() as Text)) {
      const range = document.createRange();

      range.setStart(node, annotation.selection.start);
      range.setEnd(node, annotation.selection.end);

      const span = document.createElement('span');
      span.className = 'annotation';
      span.style.color = annotation.annotation.color;
      span.textContent = replacement;
      span.title = title;

      return { range, span };
    }

    return null;
  }

  openDialog() {
    this._suppresMouseClick();
    if (this.dialog) {
      this.dialog.nativeElement.showModal();
      this.dialogOpened.set(true);
    }
  }

  closeDialog() {
    if (this.dialog) {
      this.dialog.nativeElement.close();
      this.dialogOpened.set(false);
    }
  }

  private _suppresMouseClick() {
    this._suppressClick.set(true);
    setTimeout(() => this._suppressClick.set(false));
  }

  ngAfterViewInit(): void {
    if (!this.postBody) return;
    fromEvent<MouseEvent>(this.postBody.nativeElement, 'mouseup')
      .pipe(
        filter(() => !this.dialogOpened()),
        takeUntilDestroyed(this._destoryRef),
      )
      .subscribe(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          this._annotationService.setSelection(null);
          return;
        }
        this._annotationService.setSelection(
          this._drawerService.toSnapshot(sel, this.postBody),
        );
        this._suppressClick.set(true);
        setTimeout(() => this._suppressClick.set(false));
      });
    fromEvent(document, 'click')
      .pipe(
        filter(() => !this.dialogOpened()),
        takeUntilDestroyed(this._destoryRef),
      )
      .subscribe((event) => {
        if (this._suppressClick()) {
          event.preventDefault();
          return;
        }
        this._annotationService.setSelection(null);
        if (this.dialog) {
          this.dialog.nativeElement.close();
        }
      });
  }
}
