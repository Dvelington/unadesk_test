import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { IAnotation } from '../components/annotation-edit/annotation-edit.component';

const ANNOTATION_LOCAL_STORAGE_KEY = 'annotations';

export interface IAnotationItem {
  postId: number;
  selection: ISelection;
  annotation: IAnotation;
}

interface ISelection {
  focusOffset: number;
  anchorOffset: number;
  text: string;
  rangeCount: number;
}

@Injectable({ providedIn: 'root' })
export class AnnotationService {
  private _currentSelection = signal<ISelection | null>(null);

  currentSelection = this._currentSelection.asReadonly();

  annotations = signal<IAnotationItem[]>([]);

  constructor() {
    this._initHandler();
    this._loadPosts();
  }

  setSelection(selection: ISelection | null) {
    this._currentSelection.set(selection);
  }

  addAnnotation(annotation: IAnotation) {
    const selection = this._currentSelection();
    if (!selection) return;

    this.annotations.set([
      ...(this.annotations() ?? []),
      {
        postId: annotation.postId,
        selection: selection,
        annotation,
      },
    ]);
  }

  private _initHandler(): void {
    effect(() => {
      localStorage.setItem(
        ANNOTATION_LOCAL_STORAGE_KEY,
        JSON.stringify(this.annotations()),
      );
    });
  }

  private _loadPosts(): void {
    const annotations = localStorage.getItem(ANNOTATION_LOCAL_STORAGE_KEY);
    try {
      if (annotations) {
        this.annotations.set(JSON.parse(annotations));
      }
    } catch (e) {
      console.error('Error loading annotations', e);
    }
  }
}
