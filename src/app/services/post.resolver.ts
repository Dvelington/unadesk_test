import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { IPost } from '../share/post.interface';
import { inject } from '@angular/core';
import { PostService } from './post.service';
import { of } from 'rxjs';

export const postResolver: ResolveFn<IPost | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  console.log('resolver');
  const postService = inject(PostService);
  const router = inject(Router);
  const postId = route.paramMap.get('id') || '';
  if (!postId) return new RedirectCommand(router.parseUrl('/'));
  return postService.getPostById(postId);
};
