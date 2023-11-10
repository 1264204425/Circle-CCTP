// export const formatBalance = (rawBalance: string) => {
//     const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
//     return balance
// }

export function formatBalance(rawBalance: string) {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
    return balance
}

// chainID转换为十进制
export function formatChainAsNum(chainIdHex: string) {
    const chainIdNum = parseInt(chainIdHex, 16)
    return chainIdNum
}

// chainID十进制转换为十六进制
export function formatChainAsHex(chainIdNum: number) {
    const chainIdHex = "0x" + chainIdNum.toString(16);
    return chainIdHex
}

export function formatAddress(addr: string) {
    return `${addr.substring(0, 8)}...`
}
