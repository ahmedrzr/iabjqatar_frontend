import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User} from '../../../models/data.model/user.model';
import {Group} from '../../../models/data.model/Group';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {environment} from '../../../../../environments/environment';
import validate = WebAssembly.validate;
import {UsersService} from '../../services/users.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {AdminResponse} from '../../../models/response.model/admin.response.model';
import {ToastService} from '../../../../services/toastr.service';


@Component({
    selector: 'app-user-enroll',
    templateUrl: './user-enroll.component.html',
    styleUrls: ['./user-enroll.component.css']
})
export class UserEnrollComponent implements OnInit, AfterViewInit {
    @ViewChild('FileSelectInputDialog') FileSelectInputDialog: ElementRef;
    userForm: FormGroup;
    user: User;
    userTypes: Group[] = [];
    defaultType: string;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    fileName = 'default avatar';
    isImageCropped = false;
    defaultActivationType = 0;
    base64String: any;
    userId;
    actionLabel = 'Register'
    private fieldName = '';
    private update: any = {};
    private imageChangedCount = 0;
    userName = '';
    userEmail = '';

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private userService: UsersService,
                private toast: ToastService) {

    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            if (params['id']) {
                this.userId = params['id'];
                this.setActionLabel('UPDATE');
                this.activatedRoute.data.subscribe((resolverData => {
                    if (resolverData != null) {
                        this.initForm();
                        this.user = resolverData.user.user.result;
                        this.userTypes = <Group[]>resolverData.user.groups.result;
                        this.defaultType = this.user.user_type._id;
                        this.updateFormData(this.user);
                    }
                }), error => {
                    console.log('ERROR')
                })
            } else {
                this.setActionLabel('REGISTER');
                this.activatedRoute.data.subscribe(response => {
                    this.initForm();
                    this.userTypes = response.userTypes.result;
                    this.defaultType = this.userTypes[0]._id;
                }, error => {
                    console.log('ERROR');
                })
                this.getBase64(`http://${window.location.host}/assets/img/default-avatar.png`)
            }
        });
    }

    initForm() {
        this.userForm = this.formBuilder.group({
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
            user_type: new FormControl(''),
            activated: new FormControl(0)
        });
        this.observeValueChange();
    }


    public OpenAddFilesDialog() {
        const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
        e.click();
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.fileName = this.imageChangedEvent.target.files[0].name;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.isImageCropped = true;
        this.imageChangedCount++;
    }


    onReset() {
        this.imageChangedEvent = null;
        this.croppedImage = null;
        this.fileName = '';
        this.isImageCropped = false;
    }

    DataURIToBlob(dataURI: string) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }

        return new Blob([ia], {type: mimeString})
    }

    updateFormData(user: User) {
        this.defaultType = user.user_type._id;
        this.defaultActivationType = user.activated;
        const defaultValues = {
            name: user.name,
            email: user.email,
            password: user.password,
            user_type: user.user_type._id,
            activated: user.activated
        };
        this.userForm.setValue(defaultValues)
        this.fileName = user.avatar;
        this.getBase64(environment.BASE_URL + user.avatar);
    }

    onCloseProfile() {
        this.router.navigate(['all'], {relativeTo: this.activatedRoute.parent})
    }

    onEdit() {
    }

    onRegister() {
        if (!this.userId) {
            this.enrollNewUser();
        } else {
            this.updateUser();
        }
    }

    onClear() {
        this.userForm.reset();
        this.userForm.get('user_type').patchValue(this.userTypes[0]._id);
        this.userForm.get('activated').patchValue(0);
        this.getBase64(`http://${window.location.host}/assets/img/default-avatar.png`)
    }

    ngAfterViewInit(): void {
        console.log('ngAfterViewInit');
    }

    getBase64(imgUrl) {
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.open('get', imgUrl, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (this.status === 200) {
                // Get a blob objects
                const blob = this.response;
                const oFileReader = new FileReader();
                oFileReader.onloadend = function (e) {
                    const base64 = e.target;
                    self.base64String = (<any>base64).result;
                };
                oFileReader.readAsDataURL(blob);
            }
        }
        xhr.send();
    }

    setActionLabel(action: string) {
        this.actionLabel = action;
    }

    enrollNewUser() {
        const file = this.DataURIToBlob(this.croppedImage);
        const formData = new FormData();
        formData.append('avatar', file, 'image.jpg');
        formData.append('name', this.userForm.get('name').value);
        formData.append('email', this.userForm.get('email').value);
        formData.append('password', this.userForm.get('password').value);
        formData.append('user_type', this.userForm.get('user_type').value);
        formData.append('activated', this.userForm.get('activated').value);
        this.userService.enrollUser(formData)
            .subscribe((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        break;
                    case HttpEventType.ResponseHeader:
                        break;
                    case HttpEventType.UploadProgress:
                        break;
                    case HttpEventType.Response: {
                        console.log(event.body);
                        const result: AdminResponse = event.body;
                        if (event.body.success) {
                            this.toast.onSuccess('Registration Successful!', '')
                        } else {
                            this.toast.onError(event.body.message, 'Registration Failed!')
                        }
                    }

                }
            }, err => {
                console.log('ERROR ;-) ' + err);
            })
    }

    updateUser() {
        const formData = new FormData();
        if (this.imageChangedCount > 1) {
            const avatarFile = this.DataURIToBlob(this.croppedImage);
            formData.append('avatar', avatarFile, 'image.jpg');
            formData.append('pre_avatar_path', this.user.avatar);
        }
        this.update = {};
        formData.append('_id', this.userId);
        if (this.user.name.match(this.userForm.get('name').value) === null) {
            formData.append('name', this.userForm.get('name').value);
        }
        if (this.user.email.match(this.userForm.get('email').value) === null) {
            formData.append('email', this.userForm.get('email').value);
        }
        if (this.user.password !== this.userForm.get('password').value) {
            formData.append('password', this.userForm.get('password').value);
        }
        if (this.user.activated.toString().match(this.userForm.get('activated').value) === null) {
            formData.append('activated', this.userForm.get('activated').value);
        }
        if (this.user.user_type._id.match(this.userForm.get('user_type').value) === null) {
            formData.append('user_type', this.userForm.get('user_type').value);
        }
        this.userService.updateUser(formData)
            .subscribe((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        break;
                    case HttpEventType.ResponseHeader:
                        break;
                    case HttpEventType.UploadProgress:
                        break;
                    case HttpEventType.Response:
                        if (event.body.success) {
                            this.toast.onSuccess('UPDATED', 'SUCCESS');
                        } else {
                            this.toast.onError(event.body.message, 'UPDATE FAILED!');
                        }
                }
            }, error => {
                console.log('ERROR ;-) ' + JSON.stringify(error));
            });
    }

    observeValueChange() {
    }

}
