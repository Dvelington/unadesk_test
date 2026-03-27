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
  ISelection,
} from '../../services/annotation.service';
import { AnnotationListComponent } from '../annotation-list/annotation-list.component';
import { AnnotationEditComponent } from '../annotation-edit/annotation-edit.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    AnnotationListComponent,
    AnnotationEditComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent implements AfterViewInit {
  private _postService = inject(PostService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _postData = toSignal(this._activatedRoute.data.pipe());
  private _destoryRef = inject(DestroyRef);

  private _annotationService = inject(AnnotationService);
  private _suppressClick = signal(false);
  private _sanitizer = inject(DomSanitizer);

  selection = this._annotationService.currentSelection;

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
        this.renderHighlights();
      }
    });
  }

  applyAnnotation(annotation: IAnotationItem) {
    const { text } = annotation.selection;
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

      // range.deleteContents();

      const span = document.createElement('span');
      span.className = 'annotation';
      span.style.color = annotation.annotation.color;
      span.textContent = replacement;
      span.title = title;

      // range.insertNode(span);
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
    fromEvent(document, 'mouseup')
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
        this._annotationService.setSelection(this.toSnapshot(sel));
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
    this.renderHighlights();
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  highlightedHtml = signal<SafeHtml>('');

  private renderHighlights() {
    const html = this.buildHighlightedHtml(
      this.post()?.body,
      this.postAnnotations(),
    );
    this.highlightedHtml.set(this._sanitizer.bypassSecurityTrustHtml(html));
  }

  private buildHighlightedHtml(text: string, anns: IAnotationItem[]): string {
    if (!text) return '';

    const sortedAnns = [...anns].sort(
      (a, b) => a.selection.start - b.selection.start,
    );

    let result = '';
    let lastIndex = 0;

    for (const ann of sortedAnns) {
      const { start, end } = ann.selection;

      if (start > lastIndex) {
        result += this.escapeHtml(text.slice(lastIndex, start));
      }

      const title = ann.annotation.text || '';
      const color = ann.annotation.color || '#ffeb3b';

      result += `<span class="annotation" 
                       style="text-decoration: underline; text-decoration-color: ${color};"
                       title="${this.escapeHtml(title)}">
                  ${this.escapeHtml(text.slice(start, end))}
                 </span>`;

      lastIndex = Math.max(lastIndex, end);
    }

    if (lastIndex < text.length) {
      result += this.escapeHtml(text.slice(lastIndex));
    }

    return result;
  }

  toSnapshot(sel: Selection | null): ISelection | null {
    if (!sel || sel.rangeCount === 0 || !this.postBody) return null;

    const range = sel.getRangeAt(0);
    const container = this.postBody.nativeElement;

    const start = this.getGlobalOffset(
      container,
      range.startContainer,
      range.startOffset,
    );
    const end = this.getGlobalOffset(
      container,
      range.endContainer,
      range.endOffset,
    );

    return {
      text: sel.toString(),
      start,
      end,
    };
  }

  private getGlobalOffset(
    root: HTMLElement,
    node: Node,
    offset: number,
  ): number {
    let totalChars = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
      if (currentNode === node) {
        return totalChars + offset;
      }
      totalChars += (currentNode as Text).length;
    }
    return -1;
  }
}
