import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationListComponent {}
