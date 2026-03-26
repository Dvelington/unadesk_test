import { effect, Injectable, signal } from '@angular/core';
import { IPost } from '../share/post.interface';

export const POSTS_LOCAL_STORAGE_KEY = 'posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _posts = signal<IPost[]>([]);

  constructor() {
    this._initHandler();
  }

  getPosts(): IPost[] {
    return this._posts();
  }

  addPost(newPost: IPost): void {
    this._posts.set([newPost, ...this._posts()]);
  }

  editPost() {}

  removePost(postId: number): void {
    this._posts.set(this._posts().filter((post) => post.id !== postId));
  }

  private _initHandler(): void {
    effect(() => {
      localStorage.setItem(
        POSTS_LOCAL_STORAGE_KEY,
        JSON.stringify(this._posts()),
      );
    });
  }
}
