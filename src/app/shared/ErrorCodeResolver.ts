import {Injectable} from '@angular/core';

@Injectable()
export class ErrorCodeResolverService {
    getMessage(code: number) {
        switch (code) {
            case 600: {
                return 'INVALID EMAIL';
            }
            case 601: {
                return ' MISSING REQUIRED FIELDS';
            }
            case 602: {
                return 'INVALID TOKEN';
            }
            case 603: {
                return 'PASSWORD_EMPTY';
            }
            case 604: {
                return 'EMPTY_FIELD_MISSING';
            }
            case 605: {
                return 'PASSWORD_LENGHT_MAX_EXCEEDED';
            }
            case 606: {
                return ' INVALID_EMAIL_FORMAT';
            }
            case 607: {
                return ' USER_ACTIVATED';
            }
            case 608: {
                return 'USER_DEACTIVATED';
            }
            case 609: {
                return ' INVALID_EMAIL_OR_PASSWORD';
            }
            case 610: {
                return ' EMAIL_SETTING_NOT_FOUND';
            }
            case 611: {
                return ' TOKEN_EXPIRED';
            }
            case 612: {
                return 'USED_DELETED';
            }
            case 613: {
                return 'USER_NOT_ACTIVE';
            }
            case 11000 : {
                return 'DUBLICATE ID!'
            }
            default: {
                return 'UnKnown Error';
            }
        }
    }
}

