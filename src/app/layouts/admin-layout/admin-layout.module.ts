import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {GlobalModule} from '../../shared/global.module';



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        GlobalModule
    ],
    declarations: []
})

export class AdminLayoutModule {
}
