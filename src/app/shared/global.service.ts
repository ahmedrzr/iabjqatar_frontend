import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    globalModel = new Subject<void>();

    constructor() {
    }

    showModel() {
        this.globalModel.next();
    }
}
