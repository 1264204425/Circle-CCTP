import { formatChainAsHex } from "@/utils/formot";

declare let ethereum: any;

export default async function switchNetwork(chainID: any) {
    try {
        chainID = formatChainAsHex(chainID)
        console.info("格式化后的", chainID)
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainID }], // '0x1' for Ethereum Mainnet, '0x3' for Ropsten Testnet, etc.
        });
    } catch (switchError) {
        // 如果指定的网络尚未添加到用户的MetaMask中，则可能需要添加它
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: chainID,
                        },
                    ],
                });
            } catch (addError) {
                // 处理添加网络时的错误
                console.error(addError);
            }
        }
        // 处理其他错误
        console.error(switchError);
    }
}