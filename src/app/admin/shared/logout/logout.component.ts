import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
    @Output() onYes = new EventEmitter<void>();
    @Output() onNo = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onSelectYes() {
        this.onYes.emit()
    }

    onSelectNo() {
        this.onNo.emit();
    }
}
