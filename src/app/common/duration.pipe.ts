import { Pipe, PipeTransform } from '@angular/core';
import leftPad = require('left-pad');

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(duration: any, args?: any): any {
    if (!duration) {
      return '';
    }

    const minutes = Math.floor(duration / 60),
      seconds = Math.floor(duration % 60);

    return minutes + ':' + leftPad(seconds, 2, '0');

  }

}
