import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() title = "";
  @Input() subTitle: string;
  @Input() dialogType: 'success' | 'error' | 'warn' | 'info';
  @Input() dialogRole: 'confirm' | 'info' = "confirm";
  @Input() saveBtnTxt: string;
  @Input() cancelBtnTxt: string;
  @Input() showPoropAtTitlePrefix: string;

  constructor() { }

  ngOnInit() {
  }

}
