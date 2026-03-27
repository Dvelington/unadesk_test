import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { IPost } from '../share/post.interface';
import { inject } from '@angular/core';
import { PostService } from './post.service';

export const postResolver: ResolveFn<IPost | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const postService = inject(PostService);
  const postId = route.paramMap.get('id') || '';
  if (!postId) {
    postService.setCurrentPostId(undefined);
    return undefined;
  }
  return postService.getPostById(postId);
};
