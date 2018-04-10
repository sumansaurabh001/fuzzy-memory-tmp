import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild('video')
  videoElement: ElementRef;

  videoPlaying = false;

  buttonDelayOn = false;


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


}
