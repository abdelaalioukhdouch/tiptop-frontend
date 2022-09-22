import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'participate',
  templateUrl: './participate.html',
  styleUrls: ['./participate.scss']
})
export class ParticipateComponent implements OnInit, OnDestroy {

  code: string;
  err: string;
  waiting = false;
  $destroy = new Subject();
  apiData: {
    message: string,
    ticket: any
  }

  constructor(
    private ticketSvc: TicketService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  consume(): void {
    this.err = '';
    if (this.code) {
      if (this.code.length != 10) {
        this.err = `The code must be 10 digits`;
        return;
      }
      this.waiting = true;
      this.ticketSvc.participate(this.code)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (res) => {
            console.log(res, "res");
            this.apiData = res;
          },
          error: (err) => {
            console.log(err, "err");
            this.err = err.error ? err.error.message : 'Error with request'
          }
        }).add(() => {
          this.waiting = false;
        })
    } else {
      this.err = 'Please enter code first';

    }
  }

}
