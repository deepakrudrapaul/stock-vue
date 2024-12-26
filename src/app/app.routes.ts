import { Routes } from '@angular/router';
import { AppConstants } from './shared/utils/app-constants';

export const routes: Routes = [
    {
      path: AppConstants.Routes.HOME,
      loadComponent: () => import('./home/feature/home-page.component').then((m) => m.HomePageComponent)
    },
    {
      path:AppConstants.Routes.OI_SCAN,
      loadComponent: () => import('./futures/feature/oi-scan/oi-scan.component').then((m) => m.OiScanComponent)
    },
    {
      path:AppConstants.Routes.OI_BUILD_UP,
      loadComponent: () => import('./futures/feature/oi-buildup/oi-buildup.component').then((m) => m.OiBuildupComponent)
    },
    {
      path:AppConstants.Routes.OI_DIFF,
      loadComponent: () => import('./options/feature/oi-dff/oi-dff.component').then((m) => m.OiDffComponent)
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    }
  ];
