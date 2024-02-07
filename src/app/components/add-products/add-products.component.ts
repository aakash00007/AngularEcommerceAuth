import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss'],
})
export class AddProductsComponent implements OnInit, AfterViewInit {
  addProductForm!: FormGroup;
  public categories: any = [];
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
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

  ngAfterViewInit(): void {
    document.body.style.overflowY = 'auto';
  }

  onFileUpload(event: any): void {
    const file = event.files[0];
    this.addProductForm.patchValue({
      image: file,
    });
  }

  addProduct() {
    debugger;
    if (this.addProductForm.valid) {
      const formData = new FormData();

      formData.append(
        'productName',
        this.addProductForm.get('productName')?.value
      );
      formData.append(
        'description',
        this.addProductForm.get('description')?.value
      );
      formData.append('image', this.addProductForm.get('image')?.value);
      formData.append('price', this.addProductForm.get('price')?.value);
      formData.append('quantity', this.addProductForm.get('quantity')?.value);
      formData.append(
        'categoryId',
        this.addProductForm.get('categoryId')?.value
      );
      const createdOnDate = this.addProductForm.get('createdOn')?.value;
      
      const offsetInMinutes = createdOnDate.getTimezoneOffset();
      const adjustedDate = new Date(createdOnDate.getTime() - offsetInMinutes * 60000);
      formData.append('createdOn',adjustedDate.toISOString())
      

      const imageFile = this.addProductForm.get('image')?.value;
      if (imageFile instanceof File) {
        formData.append('image', imageFile, imageFile.name);
      }
      
      console.log(this.addProductForm.get('createdOn')?.value);
      this.userService.addProducts(formData).subscribe({
        next: (res) => {
          this.addProductForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product Added Successfully',
          });
          this.router.navigate(['dashboard']);
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
      this.userService.validateAllFormFields(this.addProductForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }
}
