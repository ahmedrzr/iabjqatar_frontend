import {DashboardComponent} from './dashboard/dashboard.component';
import {MapsComponent} from './maps/maps.component';
import {UsersComponent} from './users/users.component';
import {Router, Routes} from '@angular/router';
import {UserListComponent} from './users/user-list/user-list.component';
import {UserEnrollComponent} from './users/user-enroll/user-enroll.component';
import {UsersResolver} from '../resolvers/users.resolver';
import {UserResolver} from '../resolvers/user.resolver';
import {UserTypesResolver} from '../resolvers/user.types.resolver';


export const MainRouting: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {
        path: 'users', component: UsersComponent, children: [
            {path: 'all', component: UserListComponent, resolve: {users: UsersResolver}},
            {path: '', redirectTo: 'all', pathMatch: 'full'},
            {path: 'enroll', component: UserEnrollComponent, resolve: {userTypes: UserTypesResolver}},
            {path: 'edit/:id', component: UserEnrollComponent, resolve: {user: UserResolver}},
        ]
    }
];
