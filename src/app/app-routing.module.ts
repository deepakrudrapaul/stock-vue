import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'home',
    loadComponent: () => import('./home/feature/home-page.component').then((m) => m.HomePageComponent)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
