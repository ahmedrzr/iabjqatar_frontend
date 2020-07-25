import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ErrorCodeResolverService} from '../../shared/ErrorCodeResolver';
import {AdminResponse} from '../models/response.model/admin.response.model';
import {map} from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

    constructor(private errorCodeResolverService: ErrorCodeResolverService) {
    }

    private modifySuccessBody(body: any) {
        const response: AdminResponse = {
            result: body.result,
            success: true,
            code: 0,
            message: ''
        }

        return response;
    }

    private modifyFailedBody(body: any) {
        console.log('BODY :-) \n');
        const response: AdminResponse = {
            result: body.result,
            success: false,
            code: body.code,
            message: this.errorCodeResolverService.getMessage(body.code)
        };
        return response;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.body.success) {
                        event = event.clone({body: this.modifySuccessBody(event.body)});
                    } else {
                        event = event.clone({body: this.modifyFailedBody(event.body)});
                    }
                }
                return event;
            }),
        );
    }


}
