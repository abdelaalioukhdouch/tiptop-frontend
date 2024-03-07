import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.loaderService.isLoading.next(true);

    return next.handle(req).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            this.decreaseRequests();
          }
        },
        (err) => {
          this.decreaseRequests();
          // Gestion des erreurs ici
        }
      )
    );
  }

  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this.loaderService.isLoading.next(false);
    }
  }
}
