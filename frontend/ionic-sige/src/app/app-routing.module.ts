import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'admin/usuarios/lista',
    loadChildren: () => import('./pages/admin/usuarios/lista/lista.page').then( m => m.ListaPage)
  },
  {
    path: 'admin/usuarios/lista',
    loadChildren: () => import('./pages/admin/usuarios/lista/lista.page').then( m => m.ListaPage)
  },
  {
    path: 'admin/usuarios/detalle/:id',
    loadChildren: () => import('./pages/admin/usuarios/detalle/detalle.page').then( m => m.DetallePage)
  },
  {
    path: 'admin/usuarios/crear',
    loadChildren: () => import('./pages/admin/usuarios/formulario/formulario.module').then( m => m.FormularioPageModule)
  },
  {
    path: 'admin/usuarios/editar/:id',
    loadChildren: () => import('./pages/admin/usuarios/formulario/formulario.module').then( m => m.FormularioPageModule)
  },
  {
    path: 'admin/permisos/usuario/:id',
    loadChildren: () => import('./pages/admin/permisos/usuario-permisos/usuario-permisos.module').then( m => m.UsuarioPermisosPageModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  },
  {
    path: 'detalle',
    loadChildren: () => import('./pages/admin/usuarios/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'formulario',
    loadChildren: () => import('./pages/admin/usuarios/formulario/formulario.module').then( m => m.FormularioPageModule)
  },
  {
    path: 'usuario-permisos',
    loadChildren: () => import('./pages/admin/permisos/usuario-permisos/usuario-permisos.module').then( m => m.UsuarioPermisosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}