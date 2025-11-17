import { Component, Input } from '@angular/core';
import { Post } from 'app/interfaces/Post.interface';
import { PointSimpleCard } from "@shared/point-simple-card/point-simple-card";

@Component({
  selector: 'app-list-posts',
  imports: [PointSimpleCard],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.css'
})
export class ListPosts {
  @Input() posts!: Post[];
  show: boolean = false;
  expandedPosts = new Set<string>();

  togglePostExpansion(postName: string): void {
    if (this.expandedPosts.has(postName)) {
      this.expandedPosts.delete(postName);
    } else {
      this.expandedPosts.add(postName);
    }
  }
}
