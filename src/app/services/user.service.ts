import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "http://localhost:5188/api/Admin/";
  private name$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private productsSubject = new BehaviorSubject<any[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private httpClient:HttpClient,private router:Router) { }

  public getRoleFromStorage(){
    return this.role$.asObservable();
  }

  public setRoleToStorage(role:string){
    this.role$.next(role);
  }

  public getNameFromStorage(){
    // console.log(this.name$.asObservable());
    return this.name$.asObservable();
  }

  public setNameToStorage(name:string){
    this.name$.next(name);
  }

  getProducts(){
    return this.httpClient.get<any>(`${this.baseUrl}GetAllProducts`);
  }

  getCategories(){
    return this.httpClient.get<any>(`${this.baseUrl}GetCategories`);
  }

  getTimeZones(){
    return this.httpClient.get<any>(`${this.baseUrl}GetAllTimeZones`)
  }

  getFilteredProducts(fromDate: any, toDate: any, timeZoneOffset: number): Observable<any> {
    const url = `${this.baseUrl}GetFilteredProducts/?fromDate=${fromDate}&toDate=${toDate}&timeZoneOffset=${timeZoneOffset}`;
    return this.httpClient.get(url);
  }

  addProducts(product:FormData){
    return this.httpClient.post<any>(`${this.baseUrl}AddProduct`,product);
  }

  deleteProducts(id:any){
    return this.httpClient.delete<any>(`${this.baseUrl}DeleteProduct/`+ id);
  }
  
  updateDashboard(products: any[]): void {
    this.productsSubject.next(products);
  }

  getProductById(id:any){
    return this.httpClient.get<any>(`${this.baseUrl}GetProductById/` + id);
  }

  editProduct(id:any,product:FormData){
    return this.httpClient.put<any>(`${this.baseUrl}EditProduct/` + id, product);
  }



  public validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field =>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true})
      }
      else if(control instanceof FormGroup){
        this.validateAllFormFields(control);
      }
    })
  }

  
}
