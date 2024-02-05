import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'participate',
  templateUrl: './participate.html',
  styleUrls: ['./participate.scss']
})
export class ParticipateComponent implements OnInit, OnDestroy {
  isCodeCorrect = false;
  winner: any;

  buttonLabel: string = "Participez au Grand Prix";
  hasParticipated: boolean = false;
  
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
            this.isCodeCorrect = true;
          },
          error: (err) => {
            console.log(err, "err");
            this.err = err.error ? err.error.message : 'Error with request'
            this.isCodeCorrect = false;
          }
        }).add(() => {
          this.waiting = false;
        })
    } else {
      this.err = 'Please enter code first';

    }
  }

  participateInBigPrize(): void {
    this.hasParticipated = true; // Set to true after the action is performed
    this.buttonLabel = "Participation enregistrée";
    this.ticketSvc.selectWinner().subscribe({
      next: (response) => {
        this.winner = response.winner;
      },
      error: (error) => {
        console.error('There was an error selecting the winner:', error);
      }
    });  }
  

}
