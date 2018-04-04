import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {


  @Input()
  url:string;

  @ViewChild('video')
  videoElement: ElementRef;


  videoHover = false;

  videoPlaying = false;

  constructor() { }

  ngOnInit() {

  }

  get video(): HTMLVideoElement {
    return this.videoElement ? this.videoElement.nativeElement : undefined;
  }

  play() {
    this.videoPlaying = true;
    this.video.play();
  }

  pause() {
    this.videoPlaying = false;
    this.video.pause();
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
    return this.videoHover && !this.videoPlaying;
  }

  isPauseButtonVisible() {
    return this.videoHover && this.videoPlaying;
  }


}
