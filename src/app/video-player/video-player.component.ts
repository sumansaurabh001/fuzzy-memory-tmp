import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {fadeIn, fadeInOut, fadeOut} from '../common/fade-in-out';
import {EventManager} from '@angular/platform-browser';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  animations: [fadeOut, fadeIn, fadeInOut]
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input()
  url: string;

  @Input()
  videoDuration: number;

  @Input()
  fullSize = false;

  @Input()
  allowDownload = true;

  @ViewChild('video', { static: true })
  videoElement: ElementRef;

  @ViewChild('progressBar', { read: ElementRef, static: false })
  progressBar: ElementRef;

  videoPlaying = false;

  buttonDelayOn = false;

  hoveringTimeout;

  @Output()
  close = new EventEmitter();

  @Output()
  open = new EventEmitter();

  @Output()
  exit = new EventEmitter();

  @Output()
  videoEnded = new EventEmitter();

  @Output()
  videoWatched = new EventEmitter();

  buffering = false;

  playInterval;

  volumePercentage = 100;

  volumeOn = true;

  lastVolume: number;

  fullScreen = false;

  currentSpeed = 1;

  videoSpeedItems = [0.9, 1.0, 1.25, 1.5, 2];


  constructor(private cd: ChangeDetectorRef,
              private eventManager: EventManager) {

  }

  ngOnInit() {

    this.eventManager.addGlobalEventListener('window', 'keyup', evt => {
      if (evt.keyCode == 27 && this.fullScreen) {
        this.toggleFullScreen();
        this.cd.markForCheck();
      }
    });


    if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', this.onFullScreenChange.bind(this), false);
      document.addEventListener('mozfullscreenchange', this.onFullScreenChange.bind(this), false);
      document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this), false);
      document.addEventListener('MSFullscreenChange', this.onFullScreenChange.bind(this), false);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url'] && !changes['url'].firstChange) {
      this.reset();
    }
  }

  ngAfterViewInit() {

    this.video.onwaiting = () => {
      this.buffering = true;
      this.cd.markForCheck();
    };

    this.video.onplaying = () => {
      this.buffering = false;
      this.cd.markForCheck();
    };


    this.video.onended = () => {
      this.videoEnded.next();

      this.checkIfVideoWatched();

    };

  }

  reset() {
    this.videoPlaying = false;
    this.buttonDelayOn = false;
    this.hoveringTimeout = 0;
    this.buffering = false;
    this.playInterval = undefined;
    this.volumePercentage = 100;
    this.volumeOn = true;
    this.lastVolume = undefined;
    this.currentSpeed = 1;
  }

  get video(): HTMLVideoElement {
    return this.videoElement ? this.videoElement.nativeElement : undefined;
  }

  play() {
    this.videoPlaying = true;
    this.triggerButtonDelay();
    this.video.play();
    this.playInterval = setInterval(() => this.cd.markForCheck(), 1000);
  }

  pause() {
    this.videoPlaying = false;
    this.triggerButtonDelay();
    this.video.pause();
    clearInterval(this.playInterval);
    this.playInterval = undefined;
    this.checkIfVideoWatched();
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

    if (this.hoveringTimeout) {
      clearTimeout(this.hoveringTimeout);
    }

    this.hoveringTimeout = setTimeout(() => {
      this.hoveringTimeout = undefined;
      this.cd.markForCheck();
    }, 4000);

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

  currentTime() {
    return this.video.currentTime;
  }

  currentPercentage() {
    return Math.round(this.currentTime() / this.video.duration * 100);
  }

  setVolumeOff() {
    this.volumeOn = false;
    this.lastVolume = this.video.volume;
    this.video.volume = 0;
  }

  setVolumeOn() {
    this.volumeOn = true;
    this.video.volume = this.lastVolume;

  }

  onVolumeChange(change: MatSliderChange) {

    const volumePercentage = change.value;

    if (volumePercentage == 0) {
      this.setVolumeOff();
    }
    else {
      this.volumeOn = true;
    }

    this.volumePercentage = volumePercentage;
    this.video.volume = this.volumePercentage / 100;

  }

  toggleFullScreen() {
    if (this.fullScreen) {
      this.exitFullScreen();
    }
    else {
      this.enterFullScreen();
    }
  }


  enterFullScreen() {

    const doc: any = document;
    const El: any = Element;

    if ((doc.fullScreenElement && doc.fullScreenElement !== null) ||
      (!doc.mozFullScreen && !doc.webkitIsFullScreen)) {
      if (doc.documentElement.requestFullScreen) {
        doc.documentElement.requestFullScreen();
      } else if (doc.documentElement.mozRequestFullScreen) {
        doc.documentElement.mozRequestFullScreen();
      } else if (doc.documentElement.webkitRequestFullScreen) {
        doc.documentElement.webkitRequestFullScreen(El.ALLOW_KEYBOARD_INPUT);
      }
    }
  }

  exitFullScreen() {

    const doc: any = document;

    if (doc.cancelFullScreen) {
      doc.cancelFullScreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitCancelFullScreen) {
      doc.webkitCancelFullScreen();
    }
  }


  onFullScreenChange() {

    const doc: any = document;

    this.fullScreen = !this.fullScreen;

    this.cd.markForCheck();

  }

  setVideoSpeed(speed:number) {
    this.currentSpeed = speed;
    this.video.playbackRate = this.currentSpeed;
  }

  jumpToTimestamp(event: MouseEvent) {

    const progressBar = this.progressBar.nativeElement;

    const progressBarTotalWidth = progressBar.offsetWidth,
          clickedAt = event.clientX - progressBar.getBoundingClientRect().left;

    const fractionClicked = clickedAt / progressBarTotalWidth;

    this.video.currentTime = fractionClicked * this.video.duration;
  }

  checkIfVideoWatched() {
    const played = this.getPlayedTime(this.video);

    if (played.percent > 90) {
      this.videoWatched.next();
    }
  }

  /**
   *
   * @param {HTMLVideoElement} video
   * @returns {{total: number, percent: number}}
   */

  getPlayedTime(video) {
    var totalPlayed = 0;
    var played = video.played;

    for (var i = 0; i < played.length; i++) {
      totalPlayed += played.end(i) - played.start(i);
    }

    return {
      total: totalPlayed,
      percent: totalPlayed / video.duration * 100
    };
  }

  ngOnDestroy() {
    this.video.src = "";

  }

  downloadVideo() {
    window.open(this.url);
  }


}







