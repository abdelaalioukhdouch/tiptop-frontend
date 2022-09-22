import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { RouteData } from '../routedata.interface';
import { DashboardService } from '../../../services/dashboard.service';
import { CustomFormComponent } from '../../shared/custom-form/custom-form.component';
import { CustomFormModel } from '../../shared/custom-form/custom-form.model';

@Component({
  selector: 'app-admin-font',
  templateUrl: './admin-font.component.html',
  styleUrls: ['./admin-font.component.scss']
})
export class AdminFontComponent implements OnInit, OnDestroy {

  apiData: any;

  _config: RouteData;
  @Input() set config(config: RouteData) {
    this._config = config;
  }
  get config() {
    return this._config;
  }

  noMoreRecords = false;

  $destroy = new Subject();
  constructor(
    public authSvc: AuthService,
    private dialog: MatDialog,
    private dashboardSvc: DashboardService,
    private route: ActivatedRoute
  ) {
    this.config = <RouteData>(this.route.snapshot.data);
    if (this.config) {
      this.getRecords();
    } else {
      this.dashboardSvc.showInfoDialog(`config not found`, `please contact developer`, `error`);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  getRecords(): void {
    let url = `${this.config.fetchUrl}?${this.config.fetchQueryStatic}`;
    if(this.config.pagination) {
      if(!this.apiData) this.apiData = {};
      if(!this.apiData.page) this.apiData.page = 0;
      let page = (++this.apiData.page);
      url += `&page=${page}`;
    }
    this.authSvc.get(url)
      .pipe(takeUntil(this.$destroy))
      .subscribe(res => {
        if (!this.config.pagination) {
          this.apiData = { data: null };
          this.apiData.data = res;
        } else {
          if (res && res[this.config.pagination.responseField].length) {
            if(!this.apiData) this.apiData = <any>{};
            if(!this.apiData.data) this.apiData.data = [];
            this.apiData.data = this.apiData.data.concat(res[this.config.pagination.responseField]);
            this.apiData.page = res[this.config.pagination.pageField];
            this.noMoreRecords = false;
          } else {
            this.noMoreRecords = true;
          }
        }
      })
  }


  addFont(record?: any, index?: number): void {

    let dialog = this.dialog.open(CustomFormComponent, {
      minWidth: '40%'
    });
    dialog.componentInstance.model = <CustomFormModel[]>this.config.formModel;
    if (record) {
      //edit case
      record.editing = true;
      dialog.componentInstance.valueModel = cloneDeep(record);
      dialog.componentInstance.title = `${this.config.editFormTitle}`;
      dialog.componentInstance.updateMode = true;
      dialog.componentInstance.submitUrl = `${this.config.fetchUrl}/${record[this.config.primaryKey]}`;
    } else {
      dialog.componentInstance.submitUrl = `${this.config.fetchUrl}`;
      dialog.componentInstance.title = `${this.config.addFormTitle}`;
    }
    dialog.afterClosed().subscribe(res => {
      if (res && res.result) {
        if(!this.apiData) this.apiData = {};
        if(!this.apiData.data) this.apiData.data = [];
        res.result.animated = true;
        if (record) {
          this.apiData.data[<number>(index)] = res.result;
        } else {
          this.apiData.data.push(res.result);
        }

        setTimeout(() => {
          delete res.result.animated;
        }, 5000);
      }
      try { delete record.editing; } catch (err) { }
    })
  }

  deleteFont(index: number): void {
    try { this.apiData.data[index].editing = true; } catch (err) { }
    this.dashboardSvc.showConfirmDialog(`Are you sure you want to delete this record?`, `Once you click yes, you wont be able to recover the deleted item`, (res: boolean) => {
      if (res) {
        let url = `${this.config.fetchUrl}/${this.apiData.data[index][this.config.primaryKey]}`
        this.authSvc.delete(url).pipe(takeUntil(this.$destroy))
          .subscribe((res: any) => {
            this.dashboardSvc.showInfoDialog(`The record has been deleted successfully`, ``, 'success', () => {
              this.apiData.data.splice(index, 1);
            });
          })
      }
      try { delete this.apiData.data[index].editing; } catch (err) { }
    })
  }

}
