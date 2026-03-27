import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { AnnotationService } from '../../services/annotation.service';
import { CommonModule } from '@angular/common';
import { form, required, FormField } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

export interface IAnotation {
  postId: number;
  id: number;
  text: string;
  color: string;
  content: string;
}

@Component({
  selector: 'app-anotation-edit',
  templateUrl: './annotation-edit.component.html',
  styleUrls: ['./annotation-edit.component.scss'],
  imports: [CommonModule, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationEditComponent {
  private _annotationService = inject(AnnotationService);
  private _activatedRoute = inject(ActivatedRoute);

  closeDialogEvent = output();

  isEdit = computed(() => {
    const editedAnnotationId = this._annotationService.editedAnnotationId();
    return !!editedAnnotationId;
  });

  curentSelection = this._annotationService.currentSelection;

  annotationModel = signal<IAnotation>({
    id: Date.now(),
    text: '',
    color: '#fff',
    postId: Number(this._activatedRoute.snapshot.params['id']) || 0,
    content: '',
  });

  annotationForm = form(this.annotationModel, (scheme) => {
    required(scheme.text, { message: 'Title is required' });
    required(scheme.color, { message: 'Color is required' });
  });

  constructor() {
    effect(() => {
      if (this.isEdit()) {
        const annotation = this._annotationService
          .annotations()
          .find(
            (annotation) =>
              annotation.annotation.id ===
              this._annotationService.editedAnnotationId(),
          )?.annotation;
        if (annotation) {
          this.annotationModel.set(annotation);
        }
      }
    });
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.isEdit()) {
      this._annotationService.updateAnnotation(this.annotationModel());
    } else {
      this._annotationService.addAnnotation(this.annotationModel());
      this.closeDialogEvent.emit();
    }
  }
}
