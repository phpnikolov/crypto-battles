import { Injectable } from '@angular/core';
import { BigInteger } from 'big-integer';
import * as bigInt from 'big-integer';

@Injectable()
export class ZipperService {

  constructor() { }

  public unzipUint24(zipUint24: string): number[] {
    // uint24 can hold 16,777,215
    let maxSize = 16777215;
    let bInt = bigInt(zipUint24);

    let params: number[] = [];

    for (let i = 0; i < 5; i++) {
      let p = bInt.mod(maxSize);
      bInt = bInt.minus(p).divide(maxSize);
      params.push(parseInt(p.toString(10)));
    }

    return params;
  }

}
