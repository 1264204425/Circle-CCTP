import { formatChainAsHex } from "@/utils/formot";
import { ethers } from "ethers";

declare let ethereum: any;

export default async function switchNetwork(chainID: any, rpcUrl: any, chainName: any) {
    try {
        console.info("格式化前", chainID)
        chainID = formatChainAsHex(chainID)
        // chainID = ethers.utils.hexlify(chainID)
        console.info("格式化后的", chainID)
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainID }], // '0x1' for Ethereum Mainnet, '0x3' for Ropsten Testnet, etc.
        });
        console.info("成功")
    } catch (switchError) {
        // 如果指定的网络尚未添加到用户的MetaMask中，则可能需要添加它
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: chainName,
                            chainId: chainID,
                            rpcUrls: [rpcUrl],
                        },
                    ],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
        console.error(switchError);
    }
}