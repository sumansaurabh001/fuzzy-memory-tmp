import {Component, OnInit} from '@angular/core';
import { MatDialogRef} from '@angular/material';
import {LoadingService} from '../services/loading.service';


@Component({
  selector: 'newsletter-dialog',
  templateUrl: './newsletter-dialog.component.html',
  styleUrls: ['./newsletter-dialog.component.scss'],
  providers: [
    LoadingService
  ]
})
export class NewsletterDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NewsletterDialogComponent>) {

  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

}

