import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, tap, retryWhen, delay } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { API_ROUTES } from '../services/api.config';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

const ONE_SEC = 1e3;

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {

  constructor(
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
    private toast: NbToastrService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = Number(req.headers.get('timeout') || this.defaultTimeout);

    return next
      .handle(req)
      .pipe(
        // Set a timeout based on either a set header or the default if header not set.
        timeout(timeoutValue),
        // On (any) error, retry the request after 10 seconds.
        // For requests on an interval (matches, glicko) the retry may never occur
        // do to switching to a new HTTP request observable if the interval fires.
        retryWhen(err => {
          return err.pipe(
            // Figure out which API request failed and display an error toast.
            tap(e => {
              const needle = Object.keys(API_ROUTES).find(key => API_ROUTES[key] === req.url);
              const requestedRoute = needle
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              const status = e.status ? e.status : 'N/A';
              this.showErrorToast(requestedRoute, status);
            }),
            // Wait 10 seconds before trying request again.
            delay(ONE_SEC * 10),
          );
        }),
      );
  }

  showErrorToast(route: string, status: string) {
    this.toast.danger(
      // body
      `Failed to fetch ${route}, try checking your network connection.
       Retrying in 10 seconds.`,
      // title
      `Network Error (Error code: ${status})`,
      {
        duration: ONE_SEC * 7.5,
      },
    );
  }

}
