import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard } from './auth/service/auth.Guard ';
import { Roles } from './usuarios/models/usuarios';

export const routes: Routes = [
    {
      path: 'login',
      loadComponent: () => import('./auth/login/login').then(m => m.Login)
    },
    {
      path: 'registro',
      loadComponent: () => import('./auth/registro/registro').then(m => m.Registro)
    }, 

    {
        path: '',
        component: Layout,
        canActivate: [authGuard()],
        children: [
            {
                path: '',
                loadComponent: () => 
                    import('./home/home').then(m=>m.Home)
            },

            //rutas de usuarios
            {
                path: 'perfil',
                canActivate: [authGuard([Roles.CLIENTE])],
                loadComponent: () => 
                    import('./usuarios/components/perfil/perfil').then(m=>m.Perfil)
            },

            {
                path: 'mis-envios',
                canActivate: [authGuard([Roles.CLIENTE])],
                loadComponent: () => 
                    import('./usuarios/components/mis-envios/mis-envios').then(m=>m.MisEnvios)
            },

            //rutas de dashboard
            {
                path: 'dashboard',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN])],
                loadComponent: () => 
                    import('./dashboard/dashboard').then(m=>m.Dashboard)
            },

            //rutas de envios 
            {
                path: 'envios',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.EMPLEADO])],
                loadComponent: () => 
                    import('./envios/envios').then(m=>m.Envios)
            },
            {
                path: 'envios/agregar', 
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.EMPLEADO])],
                loadComponent: () =>
                    import('./envios/agregar-envio/agregar-envio').then(m => m.AgregarEnvio)
            },
            {
                path: 'envios/ver/:id',  
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.EMPLEADO])],
                  loadComponent: () =>
                    import('./envios/agregar-envio/agregar-envio').then(m => m.AgregarEnvio)
            },
            {
                path: 'rastreo',
                canActivate: [authGuard([Roles.CLIENTE])],
                loadComponent: () => 
                    import('./envios/buscar-envio-cliente/buscar-envio-cliente').then(m => m.BuscarEnvioCliente)
            },

            //rutas de pagos 
            {
                path: 'pagos',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.EMPLEADO])],
                loadComponent: () => 
                    import('./pagos/pagos').then(m=>m.Pagos)
            },

            //rutas de productos
            {
                path: 'productos',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN])],
                loadComponent: () => 
                    import('./productos/productos').then(m=>m.Productos)
            },

            //rutas de usuarios
            {
                path: 'usuarios',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN])],
                loadComponent: () => 
                    import('./usuarios/usuarios').then(m=>m.Usuarios)
            },

            //rutas de auditoria
            {
                path: 'auditoria',
                canActivate: [authGuard([Roles.SUPER_ADMIN])],
                loadComponent: () => 
                    import('./auditoria/auditoria').then(m=>m.Auditoria)
            },

            //rutas de sedes
            {
                path: 'sede',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN])],
                loadComponent: () => 
                    import('./sede/sede').then(m=>m.Sede)
            },

             //rutas de rutas
            {
                path: 'rutas',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN])],
                loadComponent: () => 
                    import('./rutas/rutas').then(m=>m.Rutas)
            },

             //rutas de solicitudes
            {
                path: 'solicitudes',
                canActivate: [authGuard([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.EMPLEADO])],
                loadComponent: () => 
                    import('./solicitud/solicitud').then(m=>m.Solicitud)
            },
            {
              path: 'nueva-solicitud',
              canActivate: [authGuard([Roles.CLIENTE])],
              loadComponent: () =>
                import('./solicitud/solicitud-usuario/solicitud-usuario').then(m => m.SolicitudUsuario)
            },

            
            
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];
