import * as firebase from 'firebase';
import * as dayjs from 'dayjs';

export function isFutureTimestamp(timestamp: firebase.firestore.Timestamp) {
  return dayjs(timestamp.toMillis()).isAfter(dayjs());
}
