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

            //rutas de envios 
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

            //rutas de dashboard
            {
                path: 'dashboard',
                loadComponent: () => 
                    import('./dashboard/dashboard').then(m=>m.Dashboard)
            },
            
        ]
    }
];
