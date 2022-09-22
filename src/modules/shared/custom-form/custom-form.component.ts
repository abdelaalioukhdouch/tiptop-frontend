import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomFormModel } from './custom-form.model';
import { Component, OnInit, Input, ViewChildren, HostListener, ViewChild } from '@angular/core';
declare let CKEDITOR: any;
import * as _ from 'lodash';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Appsettings } from '../../../app/app.settings';


@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss']
})
export class CustomFormComponent implements OnInit {

  public infinity = Infinity;
  public BASE_URL = Appsettings.API_ENDPOINT;
  @Input() dialogRole: 'form' | 'confirm' | 'info' = "form"; //form|confirm
  @Input() dialogType: 'success' | 'error' | 'warn' | 'info';
  @Input() onlyFilledData = false;
  @Input() title = "Add education";
  @Input() subTitle: string;
  @Input() dontShowAgainBtnTxt: string;

  @Input() ignoreToasts = false;
  @Input() validateBeforeSubmit?: boolean;

  @Input() updateMode = false;
  @Input() addMoreButton = true;

  // when using inline append submit url
  @Input() formSubmitUrlPostfix: string;
  @Input() showPropAtTitle: string;
  @Input() showPoropAtTitlePrefix: string;
  @Input() timeout: number;

  _submitUrl: string;
  @Input() set submitUrl(submitUrl) {
    this._submitUrl = submitUrl;
    this.tryFetchForEdit();
  }
  get submitUrl() {
    return this._submitUrl;
  }
  _modelId: string;
  @Input() set modelId(modelId) {
    //for update mode
    this._modelId = modelId;
    this.tryFetchForEdit();
  }
  get modelId() {
    return this._modelId;
  }

  formControls: { [key: string]: FormControl } = {};

  @Input() saveBtnTxt: string;
  @Input() cancelBtnTxt: string;
  @Input() alreadyList: Array<any>;

  @ViewChild('mFileUploader', { static: false }) mFileUploader: any//UploadDocumentsComponent;

  tryFetchForEdit() {
    if (this.submitUrl && this.modelId && this.model) {
      this.AuthHttpService.get(`${this.submitUrl}/${this.modelId}`).subscribe((res: any) => {
        this.valueModel = res;
        this.validateHasOtherForEdit();
      })
    }
  }

  @Input() onSuccessMessage = "Operation is completed successfully";
  _model: CustomFormModel[] = [{ name: "name", type: "text", placeholder: 'Type name' }];

  arrayModels: any = {};
  arrayValues: any = {};

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.dialogRole == 'confirm')
      this.submit();
  }

  @Input() set model(model) {
    let ckeditorModels: CustomFormModel[] = [];
    this._model = model;
    this._model.forEach((m) => {
      if (m.url) {
        this.fetchSelectData(m);
      } else if (m.localSource) {
        this.externalData[m.name] = m.localSource;
      }

      if (m.type == 'select' && m.url) {
        this.formControls[m.name] = new FormControl();
        this.formControls[m.name].valueChanges.pipe(debounceTime(600)).subscribe(res => {
          if (m.url) {
            this.fetchSelectData(m, `${(m.queryField || 'q')}=${res}`);
          }
        })
      }

      if (m.type == 'autochips') {
        if (m.chipsConfig && !m.chipsConfig.selectedOptions) m.chipsConfig.selectedOptions = [];
        this.valueModel[m.name] = m.chipsConfig?.selectedOptions;
      }

      if (m.isArray) {
        let mm = _.cloneDeep(m);
        this.valueModel[m.name] = [m.type == 'select' && m.multiple ? [] : {}];
        this.arrayModels[m.name] = [mm];
      }

      //////////////////////////////////////////////////////////
      // if (m.type == "ckeditor") {
      // 	ckeditorModels.push(m);
      // }

      if (m.value) {
        this.valueModel[m.name] = m.value;
      }
    });
    this.tryFetchForEdit();
    ///////////////////////////////////////////////////////////////
    if (ckeditorModels.length) {
      try {
        CKEDITOR.on('instanceReady', () => {
          ckeditorModels.forEach(m => {
            try { delete m.config.loading; } catch (err) { }
          })
        });
      } catch (err) { }
    }
  }
  get model() {
    return this._model;
  }

  fetchSelectData(m: CustomFormModel, q?: string) {
    let url = m.url;
    if (q) {
      url += `?${q}`;
    }
    this.AuthHttpService.get(url, { fromCache: true }).subscribe((result: any) => {
      if (m.responseField) {
        this.externalData[m.name] = result[m.responseField];
      } else {
        this.externalData[m.name] = result;
      }
    })
  }

  addMoreArrayItem(m: CustomFormModel) {
    this.valueModel[m.name].push((m.type == 'select' && m.multiple ? [] : {}));
    this.arrayModels[m.name].push(_.cloneDeep(m));
  }
  removeArrayModel(m: CustomFormModel, j: number, e: any) {
    try { e.stopPropagation() } catch (err) { }
    // this.dashboardSvc.showConfirmDialog(`Are you sure you want to remove this item`, ``, (res: any) => {
    //   if (res && this.arrayModels[m.name]) {
    //     this.valueModel[m.name].splice(j, 1);
    //     this.arrayModels[m.name].splice(j, 1);
    //   }
    // })
  }

  validateHasOtherForEdit() {
    this.model.filter(m => m.hasOther).forEach(m => {
      if (this.valueModel[m.name + '_other']) {
        this.selectOther[m.name] = true;
      }
    })
  }

  _valueModel: any = {};
  @Input() set valueModel(valueModel) {
    this._valueModel = valueModel;
    if (valueModel) {
      (this.model || []).forEach((m) => {
        if (m.isArray && valueModel[m.name] && valueModel[m.name].length > 1) {
          //Skip for first (0 index)
          for (let i = 1; i < valueModel[m.name].length; i++) {
            this.arrayModels[m.name].push(_.cloneDeep(m));
          }
        }
      });
    }
  }
  get valueModel() {
    return this._valueModel;
  }

  externalData: any = {};

  constructor(
    public dialogRef: MatDialogRef<CustomFormComponent>,
    // public snackbar: ToastrService,
    public AuthHttpService: AuthService,
    // public dashboardSvc: DashboardService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {

  }
  err: any;
  waiting = false;
  successModel: any;
  submit(addAnother?: any) {
    let validated = this.validateForm();
    if (validated.allowed) {
      if (this.dialogRole == "form") {
        if (this.submitUrl) {
          let url = this.submitUrl;
          if (this.formSubmitUrlPostfix) {
            url += `/${this.formSubmitUrlPostfix}`;
            url = url.replace(/([^:]\/)\/+/g, "$1");
          }
          this.err = null;
          this.waiting = true;
          if (this.modelId || this.updateMode) {
            this.AuthHttpService.put(url, this.valueModel).subscribe(result => {
              // if (!this.ignoreToasts) this.snackbar.success(this.onSuccessMessage);
              this.successModel = result;
              if (this.mFileUploader && this.mFileUploader.uploader.queue.length) {
                this.uploadFile();
              } else {
                this.dialogRef.close({ result: this.successModel, valueModel: this.valueModel, addAnother });
              }
            }, err => {
              this.err = err;

              this.waiting = false;
            })
          } else {
            delete this.valueModel['_id'];
            delete this.valueModel['id'];
            this.AuthHttpService.post(url, this.valueModel).subscribe({
              next: (result) => {
                this.successModel = result;
                // if (!this.ignoreToasts) this.snackbar.success(this.onSuccessMessage);
                if (this.mFileUploader && this.mFileUploader.uploader.queue.length) {
                  this.uploadFile();
                } else {
                  this.dialogRef.close({ result: this.successModel, valueModel: this.valueModel, addAnother });
                }
              }, error: (err) => {
                this.err = err;
                if (this.err && this.err.error && this.err.error.message && this.err.error.message.toLowerCase().indexOf("duplicate entry") > -1) {
                  this.err.error.message = "Record already exists!";
                } else {
                  this.handleWriteError(this.err);
                }
                this.waiting = false;
              }
            })
          }
        } else if (this.onlyFilledData) {
          // if (this.docComps && this.docComps.length) {
          // 	this.valueModel.offlineFileUploaders = this.docComps._results.map(docComps => {
          // 		return docComps.uploader
          // 	})
          // }
          this.dialogRef.close(this.valueModel);
        } else {
          // this.snackbar.warning("Submit url is not defined, Ask developer", "OK");
        }
      } else if (this.dialogRole == "confirm") {
        this.dialogRef.close(true);
      }
    } else {
      // this.dashboardSvc.showInfoDialog(validated.message, validated.message2 || 'Validation failed!', 'error');
    }
  }

  handleWriteError(err: any) {
    console.log(err.error);
  }

  uploadFile() {
    let m = this.model.find(m => m.type == 'file');
    if (m && this.mFileUploader) {
      console.log("asdf", this.successModel)
      if (this.updateMode) {
        var id = this.valueModel._id;
      } else if (this.successModel.length) {
        try { id = this.successModel[this.successModel.length - 1]._id } catch (err) { alert(err) }
      } else if (this.successModel._id) {
        id = this.successModel._id;
      }
      if (id) {
        // this.mFileUploader.uploadFiles({ url: `${m.documentOptions.urlPrefix}/${id}` })
      } else {
        alert("not able to find id for which to upload the file in form component");
      }
    } else {
      this.dialogRef.close({ result: this.successModel, valueModel: this.valueModel });
    }
  }
  onFileUploaded(e: any, m: CustomFormModel) {
    if (e && e.length && e[0].allRecords) {
      if (this.successModel.constructor == Array) {
        console.log("1", this.successModel, e[0]);
        this.successModel = e[0].allRecords;
      } else {
        console.log("2", this.successModel, e[0]);
        this.successModel = e[0].allRecords.find((r: any) => r._id == this.successModel._id);
      }
    }
    this.dialogRef.close({ result: this.successModel, valueModel: this.valueModel, files: e });
  }

  validateForm(): { allowed: boolean, message?: string, message2?: string, model?: CustomFormModel } {

    if (!this.validateBeforeSubmit) return { allowed: true };
    for (let i = 0; i < this.model.length; i++) {
      let m = this.model[i];
      if (m.required && !this.valueModel[m.name]) {
        if (m.secondaryValidationField && this.valueModel[m.secondaryValidationField]) {
          continue;
        }
        if (m.type == 'file' && this.mFileUploader && this.mFileUploader.uploader.queue.length) {
          continue;
        }
        return { allowed: false, message: `${(m.placeholder || m.name)} is required!`, model: m };
      }
    }
    return { allowed: true };
  }

  checkIfRequired(m: CustomFormModel, i: any) {
    this.model.forEach((mm, ii) => {
      if (i != ii && mm.requiredIf && mm.requiredIf.rules && mm.requiredIf.rules.length) {

        //And Logic
        let isRequired = false;
        for (var x = 0; x < mm.requiredIf.rules.length; x++) {
          let rule = mm.requiredIf.rules[x];
          if (rule.values.includes(this.valueModel[rule.field])) {
            isRequired = true;
            break;
          }
        }
        mm.required = isRequired;
      }
    })
  }

  selectAvatar(m: CustomFormModel) {
    // let dialog = this.dialog.open(ImageCropperDialogComponent, {});
    // console.log(m.cropperOptions);
    // dialog.componentInstance.roundCropper = m.cropperOptions?.roundCorner ? true : false;
    // dialog.componentInstance.preview = m.cropperOptions?.preview ? true : false;
    // if (m.cropperOptions) {
    //   dialog.componentInstance.maintainAspectRatio = m.cropperOptions.maintainAspectRatio ? true : false;
    //   if (m.cropperOptions.aspectRatio) dialog.componentInstance.aspectRatio = m.cropperOptions.aspectRatio;
    //   if (m.cropperOptions.resizeToWidth) dialog.componentInstance.resizeToWidth = m.cropperOptions.resizeToWidth;
    // }

    // dialog.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.valueModel[m.name] = result.base64;
    //   }
    // })
  }

  cancel() {
    console.log(this.dialogRef);
    this.dialogRef.close();
  }
  selectOther: any = {};
  selectOtherToggle(e: any, key: any) {
    e.checked ? delete this.valueModel[key] : delete this.valueModel[key + '_other'];
  }
  onDateChange(e: any, m: any) {
    if (e.checked) {
      this.valueModel[m.name] = "present";
    } else {
      this.valueModel[m.name] = new Date();
    }
  }
  checkValidations(m: CustomFormModel, element: any) {
    let value = element.value;
    if (!value) return;
    try { value = value.toLowerCase(); } catch (err) { }
    if (m.checkDuplicate) {
      let record = (this.alreadyList || []).find(r => (r[m.name] || '').toLowerCase() == value);
      try {
        if (record && (record[m.name] || '').toLowerCase() == value && record[(m.uniqueKey || '')] != this.valueModel[(m.uniqueKey || '')]) {
          element.control.setErrors({ duplicate: true })
        }
      } catch (err) { }
    }
  }
  trimValue(m: CustomFormModel, element: any) {
    try { this.valueModel[m.name] = this.valueModel[m.name].trim(); } catch (err) { }
    setTimeout(() => {
      this.checkValidations(m, element);
    }, 0);
  }

  randomizeColor(m: any) {
    // let color = CommonScripts.getRandomColor();
    // this.valueModel[m.name] = color;
  }

  compareObjects(o1: any, o2: any) {
    try {
      let a = o1;
      if (typeof o1 == "object") a = a._id;
      let b = o2;
      if (typeof o2 == "object") b = b._id;
      return a == b;
    } catch (err) {
      return false;
    }
  }

  dontShowAgainBtnClicked() {
    this.dialogRef.close({ dontShowAgainButtonCalled: true });
  }
  multiselectAction(m: CustomFormModel, action: number) {
    if (action == 1) {
      this.valueModel[m.name] = this.externalData[m.name].map((a: any) => {
        if (m.bindField) return a[m.bindField];
        return a;
      })
    } else {
      this.valueModel[m.name] = [];
    }
  }

  onTimeout() {
    this.dialogRef.close();
  }


}
