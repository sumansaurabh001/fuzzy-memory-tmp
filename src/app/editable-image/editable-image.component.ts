import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FileUploadService} from '../services/file-upload.service';
import {HttpEventType} from '@angular/common/http';
import {LoadingService} from '../services/loading.service';
import {EMPTY_IMG} from '../common/ui-constants';
import {concatMap, tap} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';




@Component({
  selector: 'editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableImageComponent implements OnInit {

  editMode = false;

  @Input() src;
  @Input() imagePath:string;

  @Output() imageUploaded = new EventEmitter();

  constructor(
    private upload: FileUploadService,
    private loading: LoadingService,
    private messages: MessagesService) {

  }

  ngOnInit() {

  }

  onFileSelected(event) {

    const image = event.target.files[0];

    if (image) {
      this.loading.showLoaderUntilCompleted(this.upload.uploadImageThumbnail(image, this.imagePath))
        .pipe(
          tap(percent => {
            if (percent == 100) {
              this.messages.info("The image is being processed ...");
              this.imageUploaded.next();
            }
          })
        )
        .subscribe();
    }

  }

  onMouseEnter() {
    this.editMode = true;
  }

  onMouseLeave() {
    this.editMode = false;
  }

  stateClasses() {
    if (this.editMode) {
      return 'edit-mode';
    }
  }

  imgSrc() {
    return this.src || EMPTY_IMG;
  }

}
