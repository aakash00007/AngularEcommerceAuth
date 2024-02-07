import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private router:Router,private messageService:MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var foundToken = this.authService.getToken();
    if(foundToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${foundToken}`}
      })
    }
    return next.handle(request).pipe(
      catchError((err:any) =>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          return this.handleUnauthorisedError(request,next);
        }
      }
      return throwError(()=> {new Error('Some Error Occured')});
    }));
  }

  handleUnauthorisedError(req:HttpRequest<any>,next:HttpHandler){
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.authService.getToken()!;
    tokenApiModel.refreshToken = this.authService.getRefreshToken()!;
    return this.authService.renewToken(tokenApiModel).pipe(
      switchMap((data: TokenApiModel)=>{
        this.authService.storeRefreshToken(data.refreshToken);
        this.authService.storeToken(data.accessToken);
        req = req.clone({
          setHeaders:{Authorization : `Bearer ${data.accessToken}`}
        })
        return next.handle(req);
      }),
      catchError((err)=>{
        return throwError(()=>{
          this.messageService.add({severity: 'warn', summary:  'Session Expired', detail: 'Please Login Again' });
            this.router.navigate(['login']);
        })
      })
    )
  }
}
