import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  loginUser(name: string, key: string): Observable<boolean> {
    return this.http.post<boolean>('http://localhost:9999/users', undefined, {
      headers: new HttpHeaders({ name: name, key: key }),
    });
  }
}
