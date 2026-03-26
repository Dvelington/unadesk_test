import { Routes } from '@angular/router';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { postResolver } from './services/post.resolver';

export const routes: Routes = [
  {
    path: 'view/:id',
    resolve: {
      post: postResolver,
    },
    loadComponent: () =>
      import('./components/post-view/post-view.component').then(
        (c) => c.PostViewComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/post-edit/post-edit.component').then(
        (c) => c.PostEditComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/post-edit/post-edit.component').then(
        (c) => c.PostEditComponent,
      ),
  },

  {
    path: '',
    loadComponent: () =>
      import('./components/empty-state/empty-state.component').then(
        (c) => c.EmptyStateComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (c) => c.NotFoundComponent,
      ),
  },
];
