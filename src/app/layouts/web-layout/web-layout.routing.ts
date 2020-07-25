import {Routes} from '@angular/router';
import {HomeComponent} from '../../web/home/home.component';


export const WebLayoutRoutes: Routes = [
    {path: 'index', component: HomeComponent},
    {path: '', redirectTo: 'index', pathMatch: 'full'}

];
