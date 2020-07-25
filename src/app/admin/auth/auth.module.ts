import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AuthRouting} from './auth.routing';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRouting)
    ]
})
export class AuthModule {
}
