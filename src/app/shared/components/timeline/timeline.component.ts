// timeline.component.ts
import {Component, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  @Input() timeline: { time: Date, color: string }[] = [];

  ngOnInit() {
    this.timeline.sort((a, b) => a.time.getTime() - b.time.getTime());
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeline']) {
      this.timeline.sort((a, b) => a.time.getTime() - b.time.getTime());
    }
  }

}
