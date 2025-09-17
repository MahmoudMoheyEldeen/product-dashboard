import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonType = 'text' | 'circle' | 'rectangle' | 'square';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() borderRadius: string = '4px';
  @Input() className: string = '';
  @Input() count: number = 1;

  get skeletonClasses(): string {
    return `skeleton ${this.type} ${this.className}`;
  }

  get skeletons(): number[] {
    return Array(this.count).fill(0);
  }
}
