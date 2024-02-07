import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-editmodal',
  templateUrl: './editmodal.component.html',
  styleUrls: ['./editmodal.component.scss'],
})
export class EditmodalComponent implements OnInit {
  editProductForm!: FormGroup;
  public categories: any = [];
  public product!: any;
  productId?: number;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    public bsModalRef: BsModalRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.populateProductData();
    this.editProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      price: ['', Validators.required],
      createdOn: ['', Validators.required],
      quantity: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
    this.userService.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }

  onFileUpload(event: any) {
    if (event && event.files && event.files.length > 0) {
      const file = event.files[0];
      this.editProductForm.patchValue({
        image: file,
      });
    } else {
      this.editProductForm.patchValue({
        image: undefined,
      });
    }
  }

  editItem() {
    if (this.editProductForm.valid) {
      const formData = new FormData();

      formData.append(
        'productName',
        this.editProductForm.get('productName')?.value
      );
      formData.append(
        'description',
        this.editProductForm.get('description')?.value
      );
      formData.append('image', this.editProductForm.get('image')?.value);
      formData.append('price', this.editProductForm.get('price')?.value);
      formData.append('quantity', this.editProductForm.get('quantity')?.value);
      formData.append(
        'categoryId',
        this.editProductForm.get('categoryId')?.value
      );

      const createdOnDate = this.editProductForm.get('createdOn')?.value;

      const offsetInMinutes = createdOnDate.getTimezoneOffset();
      const adjustedDate = new Date(
        createdOnDate.getTime() - offsetInMinutes * 60000
      );
      formData.append('createdOn', adjustedDate.toISOString());

      const imageFile = this.editProductForm.get('image')?.value;
      if (imageFile instanceof File) {
        formData.append('image', imageFile, imageFile.name);
      }

      this.userService.editProduct(this.productId, formData).subscribe({
        next: (res) => {
          this.userService.getProducts().subscribe((updatedList) => {
            this.userService.updateDashboard(updatedList);
          });
          this.bsModalRef.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product Modified Successfully',
          });
        },
        error: (res) => {
          this.messageService.add({
            severity: 'error',
            summary: `${res}`,
            detail: 'Some Error Occured',
          });
        },
      });
    } else {
      this.userService.validateAllFormFields(this.editProductForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }

  populateProductData() {
    this.userService.getProductById(this.productId).subscribe((res) => {
      this.product = res;
      console.log(this.product);
      const createdOnDate = new Date(res.createdOn);
      this.editProductForm.patchValue(res);
      this.editProductForm.patchValue({
        createdOn: createdOnDate,
      });
    });
  }
}
