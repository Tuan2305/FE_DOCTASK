import { map } from 'rxjs';
import { Routes } from '@angular/router';
import { MainComponent } from './main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'viecduocgiao',
        pathMatch: 'full',
      },

      {
        path: 'document',
        loadChildren: () =>
          import('../pages/document-page/document-page-routing').then(
            (c) => c.routes
          ),
      },
      {
        path: 'viecduocgiao',
        loadChildren: () =>
          import(
            '../pages/space-page/viecduocgiao-page/viecduocgiao-routing'
          ).then((m) => m.routes),
      },
      {
        path: 'viecquanly',
        loadChildren: () =>
          import('../pages/space-page/viecquanly-page/viecquanly-routing').then(
            (m) => m.routes
          ),
      },
      {
        path: 'viecquanly/chitiet/:id',
        loadChildren: () =>
          import(
            '../pages/space-page/viecquanly-page/detail-viecquanly/detail-viecquanly-routing'
          ).then((map) => map.routes),
      },
      {
        path: 'assignJob',
        loadComponent: () =>
          import(
            '../pages/document-page/assign-job-page/assign-job-page.component'
          ).then((c) => c.AssignJobPageComponent),
      },
      {
        path: 'automation',
        loadComponent: () =>
          import('../pages/automation-page/automation-page.component').then(
            (c) => c.AutomationPageComponent
          ),
      },
      {
        path: 'AIAgent',
        loadComponent: () =>
          import('../pages/aiagent-page/aiagent-page.component').then(
            (c) => c.AIAgentPageComponent
          ),
      },
      {
        path: 'assignWork',
        loadComponent: () =>
          import('../pages/assign-work-page/assign-work-page.component').then(
            (c) => c.AssignWorkPageComponent
          ),
      },
    ],
  },
];
