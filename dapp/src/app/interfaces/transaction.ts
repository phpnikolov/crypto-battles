
export interface Transaction {
    txHash?: string,

    label: string,
    timeCreated?: number
    status?: string
    onChange?:(tx:Transaction) => void,

    to: string,
    value?: number,
    gasLimit: number,
    gasPrice?: number,
    data?: string,
}