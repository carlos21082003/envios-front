import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                loadComponent: () => 
                    import('./home/home').then(m=>m.Home)
            },

            //rutas de envios 
            {
                path: 'envios',
                loadComponent: () => 
                    import('./envios/envios').then(m=>m.Envios)
            },
            {
                path: 'envios/agregar', 
                loadComponent: () =>
                    import('./envios/agregar-envio/agregar-envio').then(m => m.AgregarEnvio)
            },
            {
                path: 'envios/ver/:id',  
                  loadComponent: () =>
                    import('./envios/agregar-envio/agregar-envio').then(m => m.AgregarEnvio)
            },
            {
                path: 'rastreo',
                loadComponent: () => 
                    import('./envios/buscar-envio-cliente/buscar-envio-cliente').then(m => m.BuscarEnvioCliente)
            },

            //rutas de pagos 
            {
                path: 'pagos',
                loadComponent: () => 
                    import('./pagos/pagos').then(m=>m.Pagos)
            },

            //rutas de productos
            {
                path: 'productos',
                loadComponent: () => 
                    import('./productos/productos').then(m=>m.Productos)
            },

            //rutas de usuarios
            {
                path: 'usuarios',
                loadComponent: () => 
                    import('./usuarios/usuarios').then(m=>m.Usuarios)
            },

            //rutas de sedes
            {
                path: 'sede',
                loadComponent: () => 
                    import('./sede/sede').then(m=>m.Sede)
            },

             //rutas de rutas
            {
                path: 'rutas',
                loadComponent: () => 
                    import('./rutas/rutas').then(m=>m.Rutas)
            },

             //rutas de solicitudes
            {
                path: 'solicitudes',
                loadComponent: () => 
                    import('./solicitud/solicitud').then(m=>m.Solicitud)
            },
            {
              path: 'nueva-solicitud',
              loadComponent: () =>
                import('./solicitud/solicitud-usuario/solicitud-usuario').then(m => m.SolicitudUsuario)
            },

            //rutas de dashboard
            {
                path: 'dashboard',
                loadComponent: () => 
                    import('./dashboard/dashboard').then(m=>m.Dashboard)
            },
            
        ]
    }
];
