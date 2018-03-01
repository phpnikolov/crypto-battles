import { Injectable } from '@angular/core';
import * as Utils from 'web3-utils';
import { WalletService } from './wallet.service';
import { ContractService } from './contract.service';
import { DialogService } from './dialog.service';

@Injectable()
export class PlayerService {

    private playerData: { [key: string]: any };

    public constructor(
        private wallet: WalletService,
        private contract: ContractService,
        private dialogService: DialogService
    ) {

    }


    public load() {
        if (!this.wallet.isUnlocked) {
            //return;
        }

        this.contract.getPlayer()
            .then((contractData) => {
                this.playerData = contractData;
            })
            .catch(err => {
                this.dialogService.addError(err);
            })
    }

    get isLoaded() : boolean {
        return (typeof this.playerData !== 'undefined');
    }

    public getLevelSize(lvl: number): number {
        return (40 * (lvl - 1) * (lvl + 8));
    }

    get address(): string {
        return this.wallet.getAddress();
    }

    get username(): string {
        return Utils.hexToString(this.playerData['_username']);
    }

    get gold(): number {
        return parseInt(this.playerData['_gold']);
    }

    get totalExperience(): number {
        return parseInt(this.playerData['_experience']);
    }

    get experience(): number {
        return this.totalExperience - this.getLevelSize(this.level);
    }

    get nextLevelExperience(): number {
        return this.getLevelSize(this.level + 1) - this.getLevelSize(this.level);
    }

    get strength(): number {
        return parseInt(this.playerData['_strength']);
    }

    get vitaility(): number {
        return parseInt(this.playerData['_vitaility']);
    }

    get intelligence(): number {
        return parseInt(this.playerData['_intelligence']);
    }

    get health(): number {
        return parseInt(this.playerData['_health']);
    }

    get level(): number {
        return parseInt(this.playerData['_level']);
    }

    get maxHealth(): number {
        return this.vitaility * 5;
    }

    get day(): number {
        return parseInt(this.playerData['_day']);
    }

    get damage(): number {
        return this.strength * 1;
    }

    get deadUntil(): number {
        return parseInt(this.playerData['_deadUntil']);
    }
}
