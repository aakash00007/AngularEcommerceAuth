import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncryptDecryptService } from '../services/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class EncryptDecryptInterceptor implements HttpInterceptor {
  constructor(private encryptDecryptService: EncryptDecryptService) {}

  ExcludeURLList = [environment.baseUrl + '/api/Admin/UploadImage'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let exludeFound = this.ExcludeURLList.some((element) =>
      req.url.includes(element)
    );

    if (!exludeFound) {
      if (req.method === 'GET') {
        if (req.url.indexOf('?') > 0) {
          let encriptURL =
            req.url.substr(0, req.url.indexOf('?') + 1) +
            this.encryptDecryptService.encryptUsingAES256(
              req.url.substr(req.url.indexOf('?') + 1, req.url.length)
            );
          const cloneReq = req.clone({
            url: encriptURL,
          });
          return next.handle(cloneReq);
        }
        return next.handle(req);
      } else if (
        req.method === 'POST' ||
        req.method === 'PUT' ||
        req.method === 'DELETE'
      ) {
        if (req.body instanceof FormData) {
          const formData = new FormData();
          req.body.forEach((value, key) => {
            if (key != 'image') {
              formData.append(
                key,
                this.encryptDecryptService.encryptUsingAES256(value)
              );
            }
          });
          const file = req.body.get('image');
          if (file != null) {
            formData.append('image', file);
          }

          const cloneReq = req.clone({
            body: formData,
            headers: req.headers.delete('Content-Type'),
          });

          return next.handle(cloneReq);
        } else if (req.body) {
          const cloneReq = req.clone({
            body: this.encryptDecryptService.encryptUsingAES256(
              JSON.stringify(req.body)
            ),
            headers: req.headers.set('Content-Type', 'application/json'),
          });
          return next.handle(cloneReq);
        }
        return next.handle(req);
      }
    }
    return next.handle(req);
  }
}
