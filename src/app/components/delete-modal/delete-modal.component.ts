import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Input } from '@angular/core'
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent{
  @Input() productId!:any;
  public products:any = [];
  constructor(private userService:UserService,private router:Router,private messageService:MessageService){}

  confirmDelete(){
    this.userService.deleteProducts(this.productId).subscribe({
      next:(res=>{
       this.userService.getProducts().subscribe(updatedList=>{
        this.userService.updateDashboard(updatedList);
        this.messageService.add({severity: 'success', summary:  'Success', detail: 'Product Deleted Successfully' });
       })
      }),
      error:(res=>{
        this.messageService.add({severity: 'error', summary:  `${res}`, detail: 'Some Error Occured' });
      })
    })
  }

}
