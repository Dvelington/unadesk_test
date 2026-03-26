import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { IPost } from '../../share/post.interface';
import { NgStyle, NgClass } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, NgClass],
})
export class PostEditComponent implements OnInit {
  id = signal('');
  isEdit = computed(() => this.id() !== '');

  postModel = signal<IPost>({
    id: Date.now(),
    title: '',
    body: '',
  });

  postForm = form(this.postModel, (scheme) => {
    required(scheme.title, { message: 'Title is required' });
    required(scheme.body, { message: 'Post message is required' });
  });

  bodyErrorState = computed(
    () =>
      this.postForm.body().errors().length > 0 &&
      this.postForm.body().touched(),
  );

  titleErrorState = computed(
    () =>
      this.postForm.title().errors().length > 0 &&
      this.postForm.title().touched(),
  );

  constructor(
    private _route: ActivatedRoute,
    private _postService: PostService,
  ) {}

  ngOnInit(): void {
    this._route.snapshot.paramMap.get('id');
    this.id.set(this._route.snapshot.paramMap.get('id') || '');
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    this._postService.addPost(this.postModel());
  }
}
