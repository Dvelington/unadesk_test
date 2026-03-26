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
    this._loadPosts();
  }

  getPosts(): IPost[] {
    return this._posts();
  }

  getPostById(id: number | string): IPost | undefined {
    return this._posts().find((post) => post.id === Number(id));
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

  private _loadPosts(): void {
    const posts = localStorage.getItem(POSTS_LOCAL_STORAGE_KEY);
    try {
      if (posts) {
        this._posts.set(JSON.parse(posts));
      }
    } catch (e) {
      console.error('Error loading posts', e);
    }
  }
}
