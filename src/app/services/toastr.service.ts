import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class ToastService {
    constructor(private toastrService: ToastrService) {
    }

    onSuccess(message: string, title: string) {
        this.toastrService.success(message, title);
    }

    onError(message: string, title: string) {
        this.toastrService.error(message, title);
    }

    onInfo(message: string, title: string) {
        this.toastrService.info(message, title);
    }
}
