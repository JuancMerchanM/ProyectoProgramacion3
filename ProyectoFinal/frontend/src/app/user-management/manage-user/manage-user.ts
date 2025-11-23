import { Component, EventEmitter, Output, signal } from '@angular/core';
import { UpdateUserComponent } from "../update-user/update-user";
import { DeleteUser } from "../delete-user/delete-user";

@Component({
  selector: 'app-manage-user',
  imports: [UpdateUserComponent, DeleteUser],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.css'
})
export class ManageUser {
  @Output() showUser = new  EventEmitter<void>();
  showUpdate = signal(true); // true = Update tab, false = Delete tab

  setTab(update: boolean) {
    this.showUpdate.set(update);
  }
}
