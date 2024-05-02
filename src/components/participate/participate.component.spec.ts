import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketService } from '../../services/ticket.service';
import { of, throwError } from 'rxjs';
import { ParticipateComponent } from './participate';

describe('ParticipateComponent', () => {
  let component: ParticipateComponent;
  let fixture: ComponentFixture<ParticipateComponent>;
  let ticketServiceStub: any;

  beforeEach(async () => {
    // Create a fake TicketService object with a `participate()` spy
    ticketServiceStub = {
      participate: jasmine.createSpy('participate').and.returnValue(of({message: "Success", ticket: {}})),
      selectWinner: jasmine.createSpy('selectWinner').and.returnValue(of({winner: "User123"}))
    };

    // Configure the testing module for this test
    await TestBed.configureTestingModule({
      declarations: [ ParticipateComponent ],
      providers: [
        { provide: TicketService, useValue: ticketServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle code submission correctly', () => {
    component.code = "1234567890";
    component.consume();
    expect(ticketServiceStub.participate).toHaveBeenCalledWith("1234567890");
    expect(component.apiData.message).toEqual("Success");
    expect(component.isCodeCorrect).toBeTrue();
  });

  it('should handle invalid code submission', () => {
    component.code = "123";
    component.consume();
    expect(component.err).toEqual("The code must be 10 digits");
    expect(component.isCodeCorrect).toBeFalse();
  });

  it('should handle participateInBigPrize', () => {
    component.participateInBigPrize();
    expect(ticketServiceStub.selectWinner).toHaveBeenCalled();
    expect(component.hasParticipated).toBeTrue();
    expect(component.buttonLabel).toEqual("Participation enregistrée");
  });

  it('should handle errors from the ticket service when participating', () => {
    ticketServiceStub.participate.and.returnValue(throwError(() => new Error('Error with request')));
    component.code = "1234567890";
    component.consume();
    expect(component.err).toContain('Error with request');
    expect(component.isCodeCorrect).toBeFalse();
  });

});
