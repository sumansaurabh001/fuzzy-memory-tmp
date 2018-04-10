import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {fadeInOut, fadeOut} from '../common/fade-in-out';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeOut]
})
export class VideoPlayerComponent implements OnInit {

  @Input()
  url:string;

  @Input()
  fullSize = false;

  @ViewChild('video')
  videoElement: ElementRef;

  videoPlaying = false;

  buttonDelayOn = false;

  hoveringTimeout;

  @Output()
  close = new EventEmitter();

  @Output()
  open = new EventEmitter();

  @Output()
  exit = new EventEmitter();


  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  get video(): HTMLVideoElement {
    return this.videoElement ? this.videoElement.nativeElement : undefined;
  }

  play() {
    this.videoPlaying = true;
    this.triggerButtonDelay();
    this.video.play();
  }

  pause() {
    this.videoPlaying = false;
    this.triggerButtonDelay();
    this.video.pause();
  }

  triggerButtonDelay() {
    this.buttonDelayOn = true;
    setTimeout(() => {
      this.buttonDelayOn = false;
      this.cd.markForCheck();
    }, 200);

  }

  toggle() {
    if (this.videoPlaying) {
      this.pause();
    }
    else {
      this.play();
    }
  }

  isPlayButtonVisible() {
    return this.videoPlaying && this.buttonDelayOn;
  }

  isPauseButtonVisible() {
    return !this.videoPlaying && this.buttonDelayOn;
  }

  onMouseMove() {
    if (!this.hoveringTimeout) {
      this.hoveringTimeout = setTimeout(() => {
        this.hoveringTimeout = undefined;
        this.cd.markForCheck();
      }, 4000);

    }
  }

  closeMenu() {
    this.close.next();
    this.fullSize = true;
  }

  openMenu() {
    this.open.next();
    this.fullSize = false;
  }

  onExit() {
    this.exit.next();
  }

  replay10() {

    this.video.currentTime -= 10;

  }

  forward10() {
    this.video.currentTime += 10;
  }


}
