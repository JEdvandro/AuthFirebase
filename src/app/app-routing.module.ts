import { AuthGuard } from './login/auth.guard';
import { Products } from './products/interface/products';
import { ListProductsPageModule } from './products/list-products/list-products.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    // loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/form-products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'list-products',
    loadChildren: () => import('./products/list-products/list-products.module').then( m => m.ListProductsPageModule)
  },
  {
    path: 'products/edit/:id',
    loadChildren: () => import('./products/form-products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'view-products/:id',
    loadChildren: () => import('./products/view-products/view-products.module').then( m => m.ViewProductsPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
