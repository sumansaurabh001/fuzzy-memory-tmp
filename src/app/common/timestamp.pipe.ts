import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(timestamp: any, args?: any): any {

    return timestamp? timestamp.toDate() : timestamp;

  }

}

