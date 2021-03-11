import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { throwError, of, Observable } from 'rxjs';
import { materialize, delay, dematerialize, map, mergeMap } from 'rxjs/operators';
import { Country } from '../models/country';
import { District } from '../models/district';
import { State } from '../models/state';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}
  getCountries() {
    return [new Country(1, 'USA'), new Country(2, 'Brazil')];
  }

  getStates() {
    return [
      new State(1, 1, 'Arizona'),
      new State(2, 1, 'Alaska'),
      new State(3, 1, 'Florida'),
      new State(4, 1, 'Hawaii'),
      new State(5, 2, 'Sao Paulo'),
      new State(6, 2, 'Rio de Janeiro'),
      new State(7, 2, 'Minas Gerais'),
    ];
  }
  getDistrict() {
    return [
      new District(1, 5, 'Arizona'),
      new District(2, 1, 'Alaska'),
      new District(3, 1, 'Florida'),
      new District(4, 3, 'Hawaii'),
      new District(5, 2, 'Sao Paulo'),
      new District(6, 2, 'Rio de Janeiro'),
      new District(7, 7, 'Minas Gerais'),
    ];
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // wrap in delayed observable to simulate server api call
    return of(null).pipe(
      mergeMap(() => {
        // get countories
        if (request.url.endsWith('/api/countries') && request.method === 'GET') {
          
          if (this.getCountries().length) {
            return of(new HttpResponse({ status: 200, body: this.getCountries() }));
          } else {
            return throwError('BadRequestError');
          }
        }

        // get state by countory id
        if (
          request.url.match(/\/api\/country\/\d+$/) &&
          request.method === 'GET'
        ) {
            let urlParts = request.url.split('/');
            let countryId = parseInt(urlParts[urlParts.length - 1]);
            let matchedState = this.getStates().filter((state) => {
              return state.countryId == countryId;
            });
            let stateBody = matchedState.length ? matchedState : [];

            return of(new HttpResponse({ status: 200, body: stateBody }));         
        }

        // get district by state id
        if (
            request.url.match(/\/api\/state\/\d+$/) &&
            request.method === 'GET'
          ) {
              let urlParts = request.url.split('/');
              let stateId = parseInt(urlParts[urlParts.length - 1]);
              let matchedState = this.getDistrict().filter((state) => {
                return state.stateId == stateId;
              });
              let stateBody = matchedState.length ? matchedState : [];
  
              return of(new HttpResponse({ status: 200, body: stateBody }));         
          }
  
        // pass through any requests not handled above
        return next.handle(request);
      }),

      // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      materialize(),
      delay(500),
      dematerialize()
    );
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
