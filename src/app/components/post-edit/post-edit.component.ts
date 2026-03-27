import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { IPost } from '../../share/post.interface';
import { NgStyle, NgClass } from '@angular/common';
import { PostService } from '../../services/post.service';

const initialFormState = {
  id: Date.now(),
  title: '',
  body: '',
};

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

  postModel = signal<IPost>(initialFormState);

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
  ) {
    effect(() => {
      if (this.isEdit()) {
        const p = this._postService.getPostById(this.id());
        console.log(p);
        if (!p) return;
        this.postModel.set(p);
      }
    });
  }

  ngOnInit(): void {
    this._route.snapshot.paramMap.get('id');
    this.id.set(this._route.snapshot.paramMap.get('id') || '');
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!this.isEdit()) {
      this._postService.addPost(this.postModel());
      this.postForm().reset({ ...initialFormState, id: Date.now() });
    } else {
      this._postService.editPost(this.postModel());
    }
  }
}
