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

    get isLoaded(): boolean {
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



    get health(): number {
        return parseInt(this.playerData['_health']);
    }

    get level(): number {
        return parseInt(this.playerData['_level']);
    }

    get maxHealth(): number {
        return parseInt(this.playerData['_maxHealth']);
    }

    get day(): number {
        return parseInt(this.playerData['_day']);
    }

    get blockNumber(): number {
        return parseInt(this.playerData['_blockNumber']);
    }

    get damage(): number {
        return parseInt(this.playerData['_damage']);
    }

    get regeneration(): number {
        return parseInt(this.playerData['_healthPer100Blocks']) / 100;
    }

    get points(): { damage: number, health: number, regeneration: number } {
        return {
            damage: parseInt(this.playerData['_damagePoints']),
            health: parseInt(this.playerData['_healthPoints']),
            regeneration: parseInt(this.playerData['_regenerationPoints'])
        }
    }

    get maxPoints() : number {
        return (this.level - 1) * 5 - (this.points.damage + this.points.health + this.points.regeneration);
    }

    get deadOn(): number {
        return parseInt(this.playerData['_deadOn']);
    }

    get isDead():boolean {
        return this.deadOn == this.day;
    }
}
