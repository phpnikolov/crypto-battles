import { Injectable } from '@angular/core';
import { BigInteger } from 'big-integer';
import * as bigInt from 'big-integer';

@Injectable()
export class ZipperService {

  constructor() { }

  public unzipUint24(zipUint24: string): number[] {
    // uint24 can hold 16,777,215
    let bInt = bigInt(zipUint24);

    let params: number[] = [];

    for (let i = 4; i >= 0; i--) {
      let offset = bigInt(2).pow(i*24);
      let p = bInt.divide(offset);
      bInt = bInt.minus(p.multiply(offset));
      params[i] = parseInt(p.toString(10));
    }

    return params;
  }

}
