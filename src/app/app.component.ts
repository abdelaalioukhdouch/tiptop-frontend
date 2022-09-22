import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../services/dashboard.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'projectdsp';

  constructor(
    private dashboardSvc: DashboardService,
    private dialog: MatDialog,
  ) {
    this.initGlobalDialog();
  }

  /* ============================================================================================================ */
  /*
    Global dialog (for info, success, errro alerts) for the app
    just call dashboardService.showInfoDialog(title, subTitle, dialogType: 'success' | 'error' | 'warn', callback?)
    or publish next() to dashboardService.dialogSubject -> { dialogRole: 'info', dialogType, title, subTitle, callback }
    would do it */
  /* ------------------------------------------------------------------------------------------------------------ */
  initGlobalDialog() {
    this.dashboardSvc.getDialogSubject().subscribe((res: any) => {
      if (res) {
        if (res.dialogRole == 'info') {
          this.showInfoDialog(res.title, res.subTitle, res.dialogType, res.callback, res.dontShowButtonLocalStorageKey)
        } else if (res.dialogRole == 'confirm') {
          this.showConfirmDialog(res.title, res.subTitle, res.callback, res.yesButtonText, res.noButtonText);
        }
      }
    })
  }
  showInfoDialog(title: string, subTitle: string, dialogType: 'success' | 'error' | 'warn' | 'info', callback?: any, dontShowButtonLocalStorageKey?: string) {
    if (dontShowButtonLocalStorageKey) {
      if (localStorage.getItem(dontShowButtonLocalStorageKey)) {
        return;
      }
    }
    let dialog = this.dialog.open(DialogComponent);
    dialog.componentInstance.dialogRole = "info";
    dialog.componentInstance.dialogType = dialogType;
    dialog.componentInstance.title = title;
    dialog.componentInstance.subTitle = subTitle;
    // dialog.componentInstance.dontShowButtonLocalStorageKey = dontShowButtonLocalStorageKey;
    dialog.afterClosed().subscribe(res => {
      if (callback) callback(res);
    })
  }
  showConfirmDialog(title: string, subTitle: string, callback?: any, yesButtonText?: string, noButtonText?: string) {
    let dialog = this.dialog.open(DialogComponent);
    dialog.componentInstance.dialogRole = "confirm";
    dialog.componentInstance.title = title;
    dialog.componentInstance.subTitle = subTitle;
    dialog.componentInstance.saveBtnTxt = yesButtonText || 'Yes';
    dialog.componentInstance.cancelBtnTxt = noButtonText || 'No';
    dialog.afterClosed().subscribe(res => {
      if (callback) callback(res);
    })
  }
  /* ============================================================================================================ */
}
