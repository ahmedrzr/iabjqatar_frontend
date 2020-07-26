import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UsersService} from '../../services/users.service';
import {AdminResponse} from '../../../models/response.model/admin.response.model';
import {UserSearchResponseModel} from '../../../models/response.model/UserSearch.Response.model';
import {User} from '../../../models/data.model/user.model';
import {range, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap, toArray} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaceholderDirective} from '../../../../shared/placeholder.directive';
import {RemoveConfirmationComponent} from '../../shared/remove-confirmation/remove-confirmation.component';
import {ToastService} from '../../../../services/toastr.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

    @ViewChild(PlaceholderDirective, {static: false}) hostRef: PlaceholderDirective
    searchForm: FormGroup;
    searchField: FormControl;
    users: User[] = [];
    pageCounts = 0;
    pageCountArray: Array<number> = [];
    currentActivePage = 0;
    hasNext: Boolean = false;
    hasPrev: Boolean = false;
    subConfirmation: Subscription;


    constructor(private fb: FormBuilder,
                private usersService: UsersService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver,
                private toastService: ToastService) {
        this.searchField = new FormControl();
        this.searchForm = fb.group({search: this.searchField});
    }

    ngOnInit(): void {
        this.onSearch();
        this.activatedRoute.data.subscribe(usersResponse => {
            this.responseHandler(usersResponse.users);
        }, error => {
            console.log('ERROR');
        })
    }

    onSubmitSearch() {
        this.getSearchFilter()
            .then(filter => {
                this.getUsers(filter, 1)
            })
    }


    getUsers(searchFilter, page) {
        this.usersService.searchUser(searchFilter, page)
            .subscribe(response => {
                this.responseHandler(response);
            }, error => {
                console.log('ERROR :-) ' + error)
            })
    }

    onSelectPage(page) {
        this.getSearchFilter()
            .then(filter => {
                this.getUsers(filter, page)
            })

    }

    onSelectNext(page: number) {
        if (this.hasNext) {
            this.getSearchFilter()
                .then(filter => {
                    this.getUsers(filter, page)
                })
        }
    }

    onSelectPrev(page: number) {
        if (this.hasPrev) {
            this.getSearchFilter()
                .then(filter => {
                    this.getUsers(filter, page)
                })
        }
    }

    getSearchFilter() {
        return new Promise((resolve, reject) => {
            if (this.searchForm.get('search').value == null) {
                resolve({search: ''})
            } else {
                resolve(this.searchForm.value);
            }
        })
    }

    onSearch() {
        this.searchField.valueChanges
            .pipe(tap(value => console.log(this.searchForm.value)))
            .pipe(debounceTime(500),
                distinctUntilChanged(),
                switchMap(term => this.usersService.searchUser(this.searchForm.value, 1))
            ).subscribe((response => {
            this.responseHandler(response);
        }))
    }

    responseHandler(response: AdminResponse) {
        if (response.success) {
            const res = <UserSearchResponseModel>response.result;
            this.users = <User[]>response.result.users;
            this.pageCounts = res.totalPages;
            this.currentActivePage = res.page;
            this.hasNext = res.hasNext;
            this.hasPrev = res.hasPrev;
            this.onGeneratePagination();
        } else {
            console.log('ERROR ' + response.code)
        }
    }

    onGeneratePagination() {
        range(1, this.pageCounts)
            .pipe(toArray()).subscribe(values => {
            this.pageCountArray = values;
        });
    }

    onEnrollUser() {
        this.router.navigate(['../', 'enroll'], {relativeTo: this.activatedRoute}).then(r => {
        });
    }

    onDeleteUserConfirmation(toDelete: { id: string, index: number }) {
        const userRemoveCompResolver = this.componentFactoryResolver.resolveComponentFactory(RemoveConfirmationComponent);
        const userRemoveHostRef = this.hostRef.viewContainerRef;
        userRemoveHostRef.clear();
        const userRemoveActionListener = userRemoveHostRef.createComponent(userRemoveCompResolver);
        this.subConfirmation = userRemoveActionListener.instance.onYes
            .subscribe(() => {
                userRemoveHostRef.clear();
                this.onDeleteUser(toDelete)
            });
        this.subConfirmation = userRemoveActionListener.instance.onNo
            .subscribe(() => {
                userRemoveHostRef.clear();
            });
        userRemoveActionListener.instance.title1 = 'Log';
        userRemoveActionListener.instance.title2 = ' Out'
        userRemoveActionListener.instance.paragraph1 = 'Are you sure you want to log out?';
        userRemoveActionListener.instance.paragraph2 = 'Press No if you want to continue work. Press Yes to logout current user.';
        userRemoveActionListener.instance.modelIcon = 'fa fa-sign-out';
        userRemoveActionListener.instance.modelStyle = 'message-box-info';
    }

    ngOnDestroy(): void {
        if (this.subConfirmation != null) {
            this.subConfirmation.unsubscribe();
        }
    }

    onDeleteUser(toDelete: { id: string, index: number }) {
        this.usersService.deleteUser(toDelete.id)
            .subscribe((response) => {
                if (response.success) {
                    this.toastService.onSuccess('User Delete', '');
                    this.users.splice(toDelete.index, 1)
                } else {
                    this.toastService.onError('Failed! ', '')
                }
            }, error => {

            })
    }

    getSearchTerm() {
        return this.searchForm.value.search;
    }

}
