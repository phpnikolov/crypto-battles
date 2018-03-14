import { Injectable } from '@angular/core';
import * as Utils from 'web3-utils';
import { WalletService } from './wallet.service';
import { ContractService } from './contract.service';
import { DialogService } from './dialog.service';
import { ZipperService } from './zipper.service';
import { Item } from '../interfaces/item';
import { ItemService } from './item.service';

@Injectable()
export class PlayerService {

    private _player: { [key: string]: any };
    private _info: { [key: string]: any };

    private _items: Item[] = [];

    public constructor(
        private wallet: WalletService,
        private contract: ContractService,
        private dialogService: DialogService,
        private zipper: ZipperService,
        private itemService: ItemService
    ) {

    }

    public loadItems() {
        if (!this.wallet.isUnlocked) {
            return;
        }
        this.contract.getItems()
            .then((data: string[]) => {
                for (let i = 0; i < data.length; i++) {
                    const itemZip = data[i];

                    this._items[i] = this.itemService.unzipItem(itemZip);
                }
            })
            .catch(err => {
                this.dialogService.addError("Can't connect to Provider");
            })
    }


    public loadPlayer() {
        if (!this.wallet.isUnlocked) {
            return;
        }

        this.contract.getPlayer()
            .then((data) => {
                this._player = data;
            })
            .catch(err => {
                this.dialogService.addError("Can't connect to Provider");
            });

        this.contract.getInfo()
            .then((data) => {
                this._info = data;
            })
            .catch(err => {
                this.dialogService.addError("Can't connect to Provider");
            })
    }

    get isLoaded(): boolean {
        return (typeof this._player !== 'undefined' && typeof this._info !== 'undefined');
    }

    public getLevelSize(lvl: number): number {
        if (lvl <= 1) {
            return 0;
        }
        if (lvl > 99) {
            lvl = 99;

        }
        return 1000 * lvl * lvl - 2000;
    }

    get address(): string {
        return this.wallet.getAddress();
    }

    get username(): string {
        return Utils.hexToString(this._player['username']);
    }

    get gold(): number {
        return parseInt(this._player['gold']);
    }

    get totalExperience(): number {
        return parseInt(this._player['experience']);
    }

    get experience(): number {
        return this.totalExperience - this.getLevelSize(this.level);
    }

    get nextLevelExperience(): number {
        return this.getLevelSize(this.level + 1) - this.getLevelSize(this.level);
    }


    get level(): number {
        return parseInt(this._player['level']);
    }

    get health(): number {
        return parseInt(this._player['health']);
    }

    get lastSynced(): number {
        return parseInt(this._player['lastSynced']);
    }

    get currentHealth(): number {
        return this._info['_currentHealth'];
    }

    get damage(): number {
        return parseInt(this._player['damage']);
    }

    get regeneration(): number {
        return parseInt(this._player['regeneration']) / 10;
    }

    get points(): number {
        return parseInt(this._player['points']);
    }

    get deadOn(): number {
        return parseInt(this._player['deadOn']);
    }

    get isDead(): boolean {
        return this._info['_isDead'];
    }
    get round(): number {
        return parseInt(this._info['_round']);
    }

    get blockNumber() : number {
        return parseInt(this._info['_blockNumber']);
    }

    get registrationBlock(): number {
        return parseInt(this._player['registrationBlock']);
    }

    get items(): Item[] {
        return this._items;
    }
}
