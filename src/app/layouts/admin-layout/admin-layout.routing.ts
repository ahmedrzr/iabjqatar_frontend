import {Routes} from '@angular/router';

import {HomeComponent} from '../../admin/home/home.component';
import {MainComponent} from '../../admin/main/main.component';
import {AuthComponent} from '../../admin/auth/auth.component';

export const AdminLayoutRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {
        path: 'main', component: MainComponent,
        children: [{path: '', loadChildren: () => import('../../admin/main/main.module').then(m => m.MainModule)}]
    },
    {path: 'auth', component: AuthComponent},
];
