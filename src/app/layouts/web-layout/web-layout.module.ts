import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {WebLayoutRoutes} from './web-layout.routing';
import {HomeComponent} from '../../web/home/home.component';


@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(WebLayoutRoutes)
    ]
})
export class WebLayoutModule {
}
