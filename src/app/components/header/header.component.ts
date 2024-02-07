import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public name: string = '';
  public role!: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userService.getNameFromStorage().subscribe((val) => {
      let nameFromToken = this.authService.getNameFromToken();
      this.name = val || nameFromToken;
    });

    this.userService.getRoleFromStorage().subscribe((val) => {
      let roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }
  signOut() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged Out Successfully',
    });
  }
}
