import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private dialogSubject = new Subject();
    private _sideNavSubject = new Subject();

    constructor(
    ) {

    }
    routeData: any = {};
    ////////////////////////////
    getDialogSubject() {
        return this.dialogSubject;
    }
    getSideNavSubject() {
        return this._sideNavSubject;
    }

    showInfoDialog(title: any, subTitle: any, dialogType: 'success' | 'error' | 'warn' | 'info', callback?: any, dontShowButtonLocalStorageKey?: any) {
        // let dialog = this.dialog.open(CustomFormDialogComponent);
        // dialog.componentInstance.dialogRole = "info";
        // dialog.componentInstance.dialogType = dialogType;
        // dialog.componentInstance.title = title;
        // dialog.componentInstance.subTitle = subTitle;
        // dialog.afterClosed().subscribe(res => {
        //     if (callback) callback();
        // })
        this.dialogSubject.next({
            dialogRole: 'info',
            dialogType,
            title,
            subTitle,
            callback,
            dontShowButtonLocalStorageKey
        })
    }

    showConfirmDialog(title: any, subTitle: any, callback?: any, yesButtonText?: any, noButtonText?: any) {
        this.dialogSubject.next({
            dialogRole: 'confirm',
            title,
            subTitle,
            yesButtonText,
            noButtonText,
            callback
        })
    }

    focusControl(id: any, scrollTo?: any, delay?: any) {
        setTimeout(() => {
            try {
                let ele: any = document.getElementById(id);
                ele.click();

                if (scrollTo) {
                    ele.scrollIntoView();
                }
            } catch (err) { }
        }, delay || 600);
    }


    showHttpResponseErrorDialog(err: any, callback?: any, options?: any) {
        this.dialogSubject.next({
            dialogRole: 'info',
            dialogType: 'error',
            title: err.error.message,
            subTitle: err.error.message2,
            callback,
            options
        })
    }

    

    

}