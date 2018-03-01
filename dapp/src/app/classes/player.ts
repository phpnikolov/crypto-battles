import * as Utils from 'web3-utils';

export class Player {


    public constructor(private contractData: any) {
        this.contractData = contractData;
    }

    public getLevelSize(lvl: number): number {
        return (40 * (lvl - 1) * (lvl + 8));
    }

    get username(): string {
        return Utils.hexToString(this.contractData['_username']);
    }

    get gold(): number {
        return parseInt(this.contractData['_gold']);
    }

    get totalExperience(): number {
        return parseInt(this.contractData['_experience']);
    }

    get experience(): number {
        return this.totalExperience - this.getLevelSize(this.level);
    }

    get nextLevelExperience(): number {
        return this.getLevelSize(this.level + 1) - this.getLevelSize(this.level);
    }

    get strength(): number {
        return parseInt(this.contractData['_strength']);
    }

    get vitaility(): number {
        return parseInt(this.contractData['_vitaility']);
    }

    get intelligence(): number {
        return parseInt(this.contractData['_intelligence']);
    }

    get health(): number {
        return parseInt(this.contractData['_health']);
    }

    get level(): number {
        return parseInt(this.contractData['_level']);
    }

    get maxHealth(): number {
        return this.vitaility * 5;
    }

    get day() : number {
        return parseInt(this.contractData['_day']);
    }

    get damage(): number {
        return this.strength * 1;
    }

    get deadUntil(): number {
        return parseInt(this.contractData['_deadUntil']);
    }
}
