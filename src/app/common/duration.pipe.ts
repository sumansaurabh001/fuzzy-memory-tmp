import { Pipe, PipeTransform } from '@angular/core';

const leftPad = require('left-pad');

const SECONDS_IN_AN_HOUR = 60 * 60;

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(duration: any, mode: string = 'minutes'): any {
    if (!duration) {
      return '';
    }

    if (mode == 'minutes') {

      const minutes = Math.floor(duration / 60),
        seconds = Math.floor(duration % 60);

      return minutes + ':' + leftPad(seconds, 2, '0');

    }
    else if (mode == 'hours') {

      const hours = Math.floor(duration / SECONDS_IN_AN_HOUR),
            minutes = Math.floor((duration % SECONDS_IN_AN_HOUR) / 60);

      return hours + ':' + leftPad(minutes, 2, '0');
    }
    else {
      return duration;
    }

  }

}
