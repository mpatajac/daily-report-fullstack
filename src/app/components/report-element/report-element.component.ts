import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-report-element',
  templateUrl: './report-element.component.html',
  styleUrls: ['./report-element.component.scss']
})
export class ReportElementComponent implements OnInit {
  @Input() label: string;
  @Output() reportElementEmitter = new EventEmitter<Array<string>>();

  constructor() { }

  ngOnInit() {
  }

  emitValue(reportElement: HTMLElement) {
    const children = reportElement.children;
    let content: string[] = [];

    for (let i = 0; i < children.length; ++i) {
      // skip empty rows (containing only <br>)
      if (children[i].innerHTML !== "<br>") {
        content.push(children[i].innerHTML);
      }
    }
    
    
    // remove <br> from the end
    const lastIndex = content.length - 1;

    // check that there is something inside
    if (lastIndex > -1) {
      content[lastIndex] = content[lastIndex].split("<br>")[0];
    }

    this.reportElementEmitter.emit(content);
  }
}
