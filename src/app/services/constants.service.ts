import { Injectable } from '@angular/core';
import { User } from '../interface/user';
import { Router } from '@angular/router';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(
    private router: Router
  ) { }

  private url: string = 'http://127.0.0.1:8080';
  private user: User = {
    login: 'joao',
    password: 'root12'
  };

  getUrl(): string {
    return this.url;
  }

  setUrl(newUrl: string): void {
    this.url = newUrl;
  }

  ckeckUser(): void {
    if (!this.user)
      this.router.navigate(['/login'])
  }

  getUser(): User {
    return this.user
  }

  setUser(user) {
    this.user = user;
  }
}
