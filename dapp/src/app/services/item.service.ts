import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item';
import { ZipperService } from './zipper.service';
import { ContractService } from './contract.service';
import { DialogService } from './dialog.service';

@Injectable()
export class ItemService {

 

  private readonly itemTypeList: { [iType: number]: string } = {
    1: 'Mace',
    2: 'Sword',
    3: 'Helm',
    4: 'Chain',
    5: 'Ring'
  }

  constructor(
    private zipper: ZipperService
  ) { 

  }


  public unzipItem(itemZip: string): Item | undefined {

    let params: number[] = this.zipper.unzipUint24(itemZip);

    if (typeof this.itemTypeList[params[0]] === 'undefined') {
      return undefined;
    }

    return {
      type: this.itemTypeList[params[0]],
      damage: params[1],
      health: params[2],
      regeneration: params[3] / 10,
      price: params[4]
    }
  }

}
