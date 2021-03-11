﻿import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Country } from '../models/country';
import { State } from '../models/state';
import { District } from '../models/district';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AddressService {
    constructor(private http: HttpClient) { }

    getAllCountories() {
        return this.http.get<Country[]>('/api/countries').pipe(
            retry(2),
            catchError(this.handleError));
    }

    getstateByCountoryId(id: number) {
        return this.http.get('/api/country/' + id).pipe(
            retry(2),
            catchError(this.handleError));;
    }

    getDistricByStateId(id: number) {
        return this.http.get('/api/state/' + id).pipe(
            retry(2),
            catchError(this.handleError));;
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      }
}