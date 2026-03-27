import { effect, Injectable, signal } from '@angular/core';
import { IAnotation } from '../components/annotation-edit/annotation-edit.component';

const ANNOTATION_LOCAL_STORAGE_KEY = 'annotations';

export interface IAnotationItem {
  postId: number;
  selection: ISelection;
  annotation: IAnotation;
}

export interface ISelection {
  text: string;
  start: number;
  end: number;
}

@Injectable({ providedIn: 'root' })
export class AnnotationService {
  private _currentSelection = signal<ISelection | null>(null);

  currentSelection = this._currentSelection.asReadonly();
  editedAnnotationId = signal<number | null>(null);

  annotations = signal<IAnotationItem[]>([]);

  constructor() {
    this._initHandler();
    this._loadAnnotations();
  }

  setEditedAnnotationId(id: number | null) {
    this.editedAnnotationId.set(id);
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

  updateAnnotation(annotation: IAnotation) {
    this.annotations.set([
      ...this.annotations().map((item) => {
        if (item.annotation.id === annotation.id) {
          return {
            ...item,
            annotation,
          };
        }
        return item;
      }),
    ]);
  }

  removeAnnotationsByPostId(postId: number) {
    this.annotations.set([
      ...this.annotations().filter((item) => item.postId !== postId),
    ]);
  }

  removeAnnotation(annotationItem: IAnotationItem) {
    this.annotations.set([
      ...this.annotations().filter(
        (item) => item.annotation.id !== annotationItem.annotation.id,
      ),
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

  private _loadAnnotations(): void {
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
