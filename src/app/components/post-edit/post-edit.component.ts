import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditComponent implements OnInit {
  id = signal('');

  private _isEdit = computed(() => this.id() !== '');

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._route.snapshot.paramMap.get('id');
    this.id.set(this._route.snapshot.paramMap.get('id') || '');
  }
}
