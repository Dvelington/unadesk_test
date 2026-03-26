import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {}
