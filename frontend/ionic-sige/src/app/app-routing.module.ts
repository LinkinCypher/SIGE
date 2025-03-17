import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PermisosGuard } from './guards/permisos.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/usuarios/lista',
    loadChildren: () => import('./pages/admin/usuarios/lista/lista.page').then( m => m.ListaPage),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'usuarios.ver' }
  },
  {
    path: 'admin/usuarios/detalle/:id',
    loadChildren: () => import('./pages/admin/usuarios/detalle/detalle.page').then( m => m.DetallePage),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'usuarios.ver' }
  },
  {
    path: 'admin/usuarios/crear',
    loadChildren: () => import('./pages/admin/usuarios/formulario/formulario.module').then( m => m.FormularioPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'usuarios.crear' }
  },
  {
    path: 'admin/usuarios/editar/:id',
    loadChildren: () => import('./pages/admin/usuarios/formulario/formulario.module').then( m => m.FormularioPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'usuarios.editar' }
  },
  {
    path: 'admin/permisos/usuario/:id',
    loadChildren: () => import('./pages/admin/permisos/usuario-permisos/usuario-permisos.module').then( m => m.UsuarioPermisosPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'permisos.asignar' }
  },
  {
    path: 'admin/direcciones/lista',
    loadChildren: () => import('./pages/admin/direcciones/lista/lista.module').then( m => m.ListaPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'direcciones.ver' }
  },
  {
    path: 'admin/direcciones/detalle/:id',
    loadChildren: () => import('./pages/admin/direcciones/detalle/detalle.module').then(m => m.DetallePageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'direcciones.ver' }
  },
  {
    path: 'admin/direcciones/crear',
    loadChildren: () => import('./pages/admin/direcciones/formulario/formulario.module').then(m => m.FormularioPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'direcciones.crear' }
  },
  {
    path: 'admin/direcciones/editar/:id',
    loadChildren: () => import('./pages/admin/direcciones/formulario/formulario.module').then(m => m.FormularioPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'direcciones.editar' }
  },
  {
    path: 'admin/cargos/lista',
    loadChildren: () => import('./pages/admin/cargos/lista/lista.module').then(m => m.ListaPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'cargos.ver' }
  },
  {
    path: 'admin/cargos/detalle/:id',
    loadChildren: () => import('./pages/admin/cargos/detalle/detalle.module').then(m => m.DetallePageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'cargos.ver' }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}