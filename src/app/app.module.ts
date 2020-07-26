import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routing';
import {AppComponent} from './app.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {WebLayoutComponent} from './layouts/web-layout/web-layout.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ErrorCodeResolverService} from './shared/ErrorCodeResolver';
import {HttpResponseInterceptor} from './admin/interceptors/http-response.interceptor';
import {ToastrModule} from 'ngx-toastr';
import {ToastService} from './services/toastr.service';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        RouterModule,
        HttpClientModule,
        AppRoutingModule,
        ModalModule.forRoot(),
        HttpClientModule,
        ToastrModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        WebLayoutComponent,
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true},
        ErrorCodeResolverService,
        ToastService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
