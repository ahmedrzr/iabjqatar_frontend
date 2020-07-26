import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MainRouting} from './main.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomeComponent} from '../home/home.component';
import {MapsComponent} from './maps/maps.component';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FooterModule} from './shared/footer/footer.module';
import {SidebarModule} from './sidebar/sidebar.module';
import {MainComponent} from './main.component';
import {UsersComponent} from './users/users.component';
import {LogoutModule} from '../shared/logout/logout.module';
import {GlobalModule} from '../../shared/global.module';
import {LogoutComponent} from '../shared/logout/logout.component';
import {UserListComponent} from './users/user-list/user-list.component';
import {UserEnrollComponent} from './users/user-enroll/user-enroll.component';
import {UserComponent} from './users/user/user.component';
import {UsersService} from './services/users.service';
import {PaginationModule} from './shared/pagination/pagination.module';
import {UsersResolver} from '../resolvers/users.resolver';
import {UserResolver} from '../resolvers/user.resolver';
import {PermissionService} from './services/permission.service';
import {ImageCropperModule} from 'ngx-image-cropper';
import {UserTypesResolver} from '../resolvers/user.types.resolver';
import { RemoveConfirmationComponent } from './shared/remove-confirmation/remove-confirmation.component';


@NgModule({
    declarations: [
        DashboardComponent,
        HomeComponent,
        MapsComponent,
        MainComponent,
        UsersComponent,
        UserListComponent,
        UserEnrollComponent,
        UserComponent,
        RemoveConfirmationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(MainRouting),
        FormsModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        FormsModule,
        LogoutModule,
        GlobalModule,
        PaginationModule,
        ImageCropperModule
    ],
    entryComponents: [LogoutComponent],
    providers: [UsersService, UsersResolver, UserResolver, PermissionService, UserTypesResolver]
})
export class MainModule {
}
