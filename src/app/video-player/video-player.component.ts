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

  constructor() { }

  ngOnInit() {

  }

  get video(): HTMLVideoElement {
    return this.videoElement ? this.videoElement.nativeElement : undefined;
  }

  play() {
    this.video.play();
  }

}
