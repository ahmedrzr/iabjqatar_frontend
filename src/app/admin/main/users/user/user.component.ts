import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {User} from '../../../models/data.model/user.model';
import {UsersService} from '../../services/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../services/toastr.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    @ViewChild('userStatus', {read: ElementRef}) userStatus: ElementRef;
    @Input() users: User[] = [];
    @Output('onDeleteUser') deleteUserEmitter = new EventEmitter<{ id: String, index: Number }>();
    BASE_UTL = environment.BASE_URL;

    constructor(private usersService: UsersService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastService) {
    }

    ngOnInit(): void {
    }

    getAvatar(path: string) {
        return this.BASE_UTL + path;
    }

    isStatusChanged(id: string, prevStatus: number) {
        const status = (prevStatus !== 0);
        if (status !== this.userStatus.nativeElement.checked) {
            this.usersService.changeUserState(id, this.userStatus.nativeElement.checked)
                .subscribe(response => {
                    if (response.success) {
                        this.toastService.onSuccess('Status changed.', '')
                    } else {
                        this.toastService.onError(response.message, 'Failed');
                    }
                }, error => {
                    console.log('ERROR')
                })
        }
    }

    onEditUser(id: string) {
        this.router.navigate(['../', 'edit', id], {relativeTo: this.activatedRoute}).then(r => {
        })
    }

    onUserDelete(id: string, index: number) {
        this.deleteUserEmitter.emit({id: id, index: index})
    }

}
