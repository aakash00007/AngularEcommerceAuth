import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { EditmodalComponent } from './components/editmodal/editmodal.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { EncryptDecryptInterceptor } from './interceptors/encrypt-decrypt.interceptor';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AddProductsComponent,
    HeaderComponent,
    DeleteModalComponent,
    EditmodalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule,
    ToastModule,
    ButtonModule,
    FileUploadModule,
    FormsModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    DatePipe,
    CommonModule
  ],
  providers: [
    MessageService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncryptDecryptInterceptor,
      multi: true
  },
    BsModalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
