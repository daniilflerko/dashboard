import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable } from "rxjs";
import { CurrentUserInterface } from "../types/currentUser.interface";
import { HttpClient } from '@angular/common/http'
import { environment } from "src/environments/environment";
import { RegisterRequestInterface } from "../types/registerRequest.interface";
import { LoginRequestInterface } from "../types/loginRequest.interface";
import { SocketService } from "src/app/shared/services/socket.service";

@Injectable() //use for services
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined);

  isLoggedIn$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => Boolean(currentUser))
  );

  constructor(private http: HttpClient, private socketService: SocketService) {}



  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/user';
    return this.http.get<CurrentUserInterface>(url);
  }

  register(registerRequest: RegisterRequestInterface): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users';
    return this.http.post<CurrentUserInterface>(url, registerRequest);
  }

  login(loginRequest: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users/login';
    return this.http.post<CurrentUserInterface>(url, loginRequest);
  }

  setToken(currentUser: CurrentUserInterface): void { //stores token in local storage
    localStorage.setItem('token', currentUser.token)
    localStorage.setItem('username', currentUser.username)
  }

  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }

  logout():void {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    this.currentUser$.next(null)
    this.socketService.disconnect()
  }
}
