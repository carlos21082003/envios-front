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
                }
            
        ]
    }
];
