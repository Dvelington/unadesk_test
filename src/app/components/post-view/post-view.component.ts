import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { IPost } from '../../share/post.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';
import { filter, fromEvent } from 'rxjs';
import { AnnotationService } from '../../services/annotation.service';
import { RightClickDirective } from '../../services/right-click.directive';
import { AnnotationListComponent } from '../annotation-list/annotation-list.component';
import { AnnotationEditComponent } from '../annotation-edit/annotation-edit.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    RightClickDirective,
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

  selection = this._annotationService.currentSelection;

  hasSelection = computed(
    () => this.selection() && (this.selection()?.rangeCount ?? 0),
  );

  dialogOpened = signal(false);

  @ViewChild('dialog')
  dialog?: ElementRef<HTMLDialogElement>;

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
      if (!this.isPostExist()) {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
      }
    });
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
  }

  toSnapshot(sel: Selection | null): {
    focusOffset: number;
    anchorOffset: number;
    text: string;
    rangeCount: number;
  } | null {
    if (!sel || sel.rangeCount === 0) return null;

    return {
      rangeCount: sel.rangeCount,
      focusOffset: sel.focusOffset,
      anchorOffset: sel.anchorOffset,
      text: sel.toString(),
    };
  }
}
