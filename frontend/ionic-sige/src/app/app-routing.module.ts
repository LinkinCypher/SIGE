import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PermisosGuard } from './guards/permisos.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/usuarios/lista',
    loadComponent: () => import('./pages/admin/usuarios/lista/lista.page').then(m => m.ListaPage),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'usuarios.ver' }
  },
  {
    path: 'admin/usuarios/detalle/:id',
    loadComponent: () => import('./pages/admin/usuarios/detalle/detalle.page').then( m => m.DetallePage),
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
    path: 'admin/permisos/lista',
    loadChildren: () => import('./pages/admin/permisos/lista/lista.module').then(m => m.ListaPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'permisos.ver' }
  },
  {
    path: 'admin/permisos/asignacion-masiva',
    loadChildren: () => import('./pages/admin/permisos/asignacion-masiva/asignacion-masiva.module').then(m => m.AsignacionMasivaPageModule),
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
  {
    path: 'admin/cargos/crear',
    loadChildren: () => import('./pages/admin/cargos/formulario/formulario.module').then(m => m.FormularioPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'cargos.crear' }
  },
  {
    path: 'admin/cargos/editar/:id',
    loadChildren: () => import('./pages/admin/cargos/formulario/formulario.module').then(m => m.FormularioPageModule),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'cargos.editar' }
  },
  {
    path: 'admin/paginas/lista',
    loadComponent: () => import('./pages/admin/paginas/lista/lista.page').then(m => m.ListaPage),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'paginas.ver' }
  },
  {
    path: 'admin/paginas/crear',
    loadComponent: () => import('./pages/admin/paginas/crear/crear.page').then(m => m.CrearPage),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'paginas.crear' }
  },
  {
    path: 'admin/paginas/editar/:id',
    loadComponent: () => import('./pages/admin/paginas/editar/editar.page').then(m => m.EditarPage),
    canActivate: [AuthGuard, PermisosGuard],
    data: { permiso: 'paginas.editar' }
  },
  {
    path: 'admin/paginas',
    redirectTo: 'admin/paginas/lista',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}