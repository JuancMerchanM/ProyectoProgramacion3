import { Component, Input } from '@angular/core';
import { MarkbookSimple } from 'app/interfaces/MarkbookSimple.interface';
import { Post } from 'app/interfaces/Post.interface';
import { MarkbookSimpleCard } from "@shared/markbook-simple-card/markbook-simple-card";

@Component({
  selector: 'app-list-posts',
  imports: [MarkbookSimpleCard],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.css'
})
export class ListPosts {
 @Input() posts!: Post[];
  show: boolean = false;

 showAllPosts() {
    if (this.show === true) {
      this.show = !this.show;
    } else {
      this.show = true;
    }
  }
}
