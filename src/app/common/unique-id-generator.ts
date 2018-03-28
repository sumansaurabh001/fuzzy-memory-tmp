

import * as shortid from 'shortid';

// use $ and @ instead of - and _
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');




export function generateId() {
  return shortid.generate();
}

