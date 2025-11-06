import { Component } from '@angular/core';
import { ShowMap } from 'app/map-management/show-map/show-map';
import { ListPosts } from 'app/post-management/list-posts/list-posts';
import { CreateRoute } from 'app/route-management/create-route/create-route';
import { UserList } from 'app/user-management/user-list/user-list';

@Component({
  selector: 'app-home',
  imports: [ShowMap, UserList, ListPosts, CreateRoute, ShowMap],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  panelOpen = false;
  activePanel: string | null = null;

  togglePanel(panel: string) {
    if (this.activePanel === panel) {
      this.panelOpen = !this.panelOpen;
    } else {
      this.panelOpen = true;
      this.activePanel = panel;
    }
  }
}
