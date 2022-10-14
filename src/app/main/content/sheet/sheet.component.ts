import { Sheet, SheetService } from './sheet.service';
import { UserService } from './../../../user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.less'],
})
export class SheetComponent implements OnInit {
  constructor(private user: UserService, private sheetService: SheetService) {}
  sheets: Sheet[] = [];
  ngOnInit(): void {
    this.sheetService.getSheet().add(() => {
      this.sheets = this.sheetService.sheets;
    });
  }
}
