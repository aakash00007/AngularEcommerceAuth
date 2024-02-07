import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditmodalComponent } from 'src/app/components/editmodal/editmodal.component';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public products: any[] = [];
  public currProductId!: number;
  public role!: string;
  bsModalRef?: BsModalRef;
  isTimezoneSelected: any;
  visible: boolean = false;
  timeZones: any[] = [];
  selectedTimeZone: any;
  fromDate: any;
  toDate: any;
  selectedTimeZoneOffset: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modalService: BsModalService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userService.products$.subscribe((products:any) => {
      this.products = products.item1;
      this.products.forEach((element: any) => {
        element.createdOn = moment(element.createdOn).format(
          'YYYY-MM-DD hh:mm A'
        );
      });
    });

    this.userService.getProducts().subscribe((res) => {
      this.products = res.item1;
      this.products.forEach((element: any) => {
        element.createdOn = moment(element.createdOn).format(
          'YYYY-MM-DD hh:mm A'
        );
      });
    });

    this.userService.getRoleFromStorage().subscribe((val) => {
      let roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.userService.getTimeZones().subscribe((res) => {
      res.forEach((element: any) => {
        this.timeZones.push(element);
      });
      this.visible = true;
    });
  }

  onSave() {
    if (this.selectedTimeZone) {
      this.selectedTimeZoneOffset = this.selectedTimeZone.utcOffSet;
      this.products.forEach((item: any) => {
        item.createdOn = moment(item.createdOn)
          .add(this.selectedTimeZone.utcOffSet, 'h')
          .format('YYYY-MM-DD hh:mm A');
      });
    }

    this.isTimezoneSelected = true;
  }

  searchProducts() {
    if (!this.fromDate || !this.toDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select both from and to dates.'
      });
      return;
    }
  
    if (this.toDate < this.fromDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'To Date should be greater than or equal to From Date.'
      });
      return;
    }

    const timeZoneOffsetInMinutes = this.convertOffsetToMinutes(
      this.selectedTimeZoneOffset
    );
    const fromOffset = this.fromDate.getTimezoneOffset();
    const toOffset = this.toDate.getTimezoneOffset();
    this.fromDate = new Date(this.fromDate.getTime() - fromOffset * 60000);
    this.toDate = new Date(this.toDate.getTime() - toOffset * 60000);
    this.toDate.setHours(this.toDate.getHours() + 23);
    this.toDate.setMinutes(this.toDate.getMinutes() + 59);

    this.userService
      .getFilteredProducts(
        this.fromDate.toISOString(),
        this.toDate.toISOString(),
        timeZoneOffsetInMinutes
      )
      .subscribe((res) => {
        this.products = res.item1;
        this.products.forEach((element: any) => {
          element.createdOn = moment(element.createdOn).format(
            'YYYY-MM-DD hh:mm A'
          );
        });
      });
  }

  private convertOffsetToMinutes(offset: any): any {
    const offsetDuration = moment.duration(offset).asMinutes();
    return offsetDuration;
  }

  getRelativeImageUrl(absolutePath: string) {
    if(absolutePath == null || undefined || ''){
      return;
    }
    const baseUrl = environment.baseUrl;

    const relativePath = absolutePath.replace(
      'D:\\ECommerce_Aakash\\ECommerceBackend_Aakash\\ECommerceBackend_Aakash\\ECommerceBackend_Aakash\\wwwroot\\Resources/images\\',
      '/Resources/images/'
    );

    const imageUrl = `${baseUrl}${relativePath}`;
    return imageUrl;
  }

  passId(id: any) {
    this.currProductId = id;
  }

  openEditModal(productId: number) {
    const initialState = {
      productId: productId,
    };

    this.bsModalRef = this.modalService.show(EditmodalComponent, {
      initialState,
    });
  }
}
