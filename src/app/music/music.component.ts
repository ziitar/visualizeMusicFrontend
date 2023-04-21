import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.less'],
})
export class MusicComponent implements OnInit {
  library: string[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    window.electronAPI?.handleFiles((event, files) => {
      if (files) {
        this.library = files;
        event.sender.send('update-files', 1);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnInit(): void {}
}
