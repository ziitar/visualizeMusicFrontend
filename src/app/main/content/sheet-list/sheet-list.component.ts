import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less'],
})
export class SheetListComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  sheetId: number | undefined;
  // songs:
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.sheetId = Number(routeParams.get('sheetId'));
  }
}
