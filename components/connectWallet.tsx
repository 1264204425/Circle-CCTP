import { ethers } from "ethers";
import globalData from "@/models/globalData";
import { useSDK } from "@metamask/sdk-react";
import { SDKProvider } from "@metamask/sdk";

const initialGlobalData: globalData = {
    account: null,
    recipient: null,
    amount: null,
    tokenBalance: null,
    coinBalance: null,
    coinSymbol: null,
    coinUSDCPair: null,
    AmountInForSwap: null,
    AmountOutForSwap: null,
    chainName: null,
    coinPrice: null,
    name: null,
    decimal: null,
    symbol: null,
    supply: null,
    connectedBool: false,
    SourceChainIdInHexa: null,
    TargetChainIdInHexa: null,
    errorMessage: null,
    tips: null,
}

// 检测用户是否使用手机
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export async function disconnectWallet() {
    try {
        initialGlobalData.account = null; // 清除帐户信息
        initialGlobalData.connectedBool = false; // 将连接状态设置为false
        initialGlobalData.chainName = null; // 清除链名称
        initialGlobalData.coinSymbol = null; // 清除代币符号

        console.info("断开连接", initialGlobalData)
        console.info("Disconnected from wallet");

    } catch (error) {
        console.error("Error disconnecting from wallet:", error);
    }
}


export async function getCoinSymbol(chainId: number) {
    const ethChains = [1, 5, 10, 420, 42161, 8453, 84531];
    const avaxChains = [43114, 43113];
    const agorChains = [421613];
    if (ethChains.includes(chainId)) {
        initialGlobalData.coinSymbol = 'ETH';
        initialGlobalData.coinUSDCPair = 'ETHUSDT';
        const coinSymbol = 'ETH';
        const coinUSDCPair = 'ETHUSDT'

    } else if (avaxChains.includes(chainId)) {
        initialGlobalData.coinSymbol = 'AVAX';
        initialGlobalData.coinUSDCPair = 'AVAXUSDT';
    } else if (agorChains.includes(chainId)) {
        initialGlobalData.coinSymbol = 'AGOR';
        initialGlobalData.coinUSDCPair = 'ETHUSDT';
    } else {
        const errorMessage = 'Chain ID not recognized.';
        console.info(errorMessage);
    }
    console.info(initialGlobalData.coinSymbol, initialGlobalData.coinUSDCPair)
    // console.info(`Coin symbol: ${this.coinSymbol}`);
}

export async function getNetworkInfo(chainId: number) {
    switch (chainId) {
        // mainnet
        case 1:
            initialGlobalData.chainName = 'Ethereum Mainnet';
            // this.scanApiKey = process.env.ETHERSCAN_API_KEY;
            // this.scanRPCURL = process.env.ETHEREUM_RPC_URL;
            // this.USDCProxyAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
            // this.USDCAddress = '0xa2327a938Febf5FEC13baCFb16Ae10EcBc4cbDCF';
            // this.RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
            // this.WrappedCoinAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
            // this.scanApiURL = 'https://api.etherscan.io/api';
            break;
        case 43114:
            this.chainName = 'Avalanche C-Chain';
            // this.scanApiKey = process.env.SNOWTRACE_API_KEY;
            // this.scanRPCURL = process.env.AVALANCHE_RPC_URL;
            this.USDCProxyAddress = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
            this.USDCAddress = '0xa3fa3D254bf6aF295b5B22cC6730b04144314890';
            this.RouterAddress = '0x60ae616a2155ee3d9a68541ba4544862310933d4';
            this.WrappedCoinAddress = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
            this.scanApiURL = 'https://api.snowtrace.io/api';
            break;
        case 10:
            this.chainName = 'Optimism Mainnet';
            // this.scanApiKey = process.env.OPTIMISMSCAN_API_KEY;
            // this.scanRPCURL = process.env.OPTIMISM_RPC_URL;
            this.USDCProxyAddress = '0x0b2c639c533813f4aa9d7837caf62653d097ff85';
            this.USDCAddress = '0xbd17DEee53a58B48548117a11a2E7bbF2D0d6Fa7';
            this.RouterAddress = '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858';
            this.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            this.scanApiURL = 'https://api-optimistic.etherscan.io/api';
            break;
        case 42161:
            this.chainName = 'Arbitrum One';
            // this.scanApiKey = process.env.ARBISCAN_API_KEY;
            // this.scanRPCURL = process.env.ARBITRUM_RPC_URL;
            this.USDCProxyAddress = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
            this.USDCAddress = '0x0f4fb9474303d10905AB86aA8d5A65FE44b6E04A';
            this.RouterAddress = '0xbeE5c10Cf6E4F68f831E11C1D9E59B43560B3642';
            this.WrappedCoinAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
            this.scanApiURL = 'https://api.arbiscan.io/api';
            break;
        case 8453:
            this.chainName = 'Base';
            // this.scanApiKey = process.env.BASE_API_KEY;
            // this.scanRPCURL = process.env.BASE_RPC_URL;
            this.USDCProxyAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
            this.USDCAddress = '0x6D0c9A70D85E42Ba8B76dc06620d4E988ec8D0C1';
            this.RouterAddress = '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86';
            this.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            this.scanApiURL = 'https://api.basescan.org/api';
            break;
        // testnet
        case 5:
            this.chainName = 'Ethereum-Goerli';
            // this.scanApiKey = process.env.ETHERSCAN_API_KEY;
            // this.scanRPCURL = process.env.ETHEREUM_GOERLI_RPC_URL;
            this.USDCProxyAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';
            this.USDCAddress = '0xe27658a36cA8A59fE5Cc76a14Bde34a51e587ab4';
            this.RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
            this.WrappedCoinAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
            this.scanApiURL = 'https://api-goerli.etherscan.io/api';
            break;
        case 43113:
            this.chainName = 'Avalanche-Fuji';
            // this.scanApiKey = process.env.SNOWTRACE_API_KEY;
            // this.scanRPCURL = process.env.AVALANCHE_FUJI_RPC_URL;
            this.USDCProxyAddress = '0x5425890298aed601595a70ab815c96711a31bc65';
            this.USDCAddress = '0x79beb0a978443dBc125599170332b3F40D448F63';
            this.RouterAddress = '0x3705aBF712ccD4fc56Ee76f0BD3009FD4013ad75';
            this.WrappedCoinAddress = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c';
            this.scanApiURL = 'https://api-testnet.snowtrace.io/api';
            break;
        case 420:
            this.chainName = 'Optimism-Goerli';
            // this.scanApiKey = process.env.OPTIMISMSCAN_API_KEY;
            // this.scanRPCURL = process.env.OPTIMISM_GOERLI_RPC_URL;
            this.USDCProxyAddress = '0xe05606174bac4a6364b31bd0eca4bf4dd368f8c6';
            this.USDCAddress = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85';
            this.RouterAddress = '0x8F1f2A89930dC9aaa7B5a799AC695dF809B0fbe5';
            this.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            this.scanApiURL = 'https://api-goerli-optimistic.etherscan.io/api';
            break;
        case 421613:
            this.chainName = 'Arbitrum-Goerli';
            // this.scanApiKey = process.env.ARBISCAN_API_KEY;
            // this.scanRPCURL = process.env.ARBITRUM_GOERLI_RPC_URL;
            this.USDCProxyAddress = '0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63';
            this.USDCAddress = '0xC042E9E8cE7eB153a9B3113F91ABbF1065dfC44e';
            this.RouterAddress = '0x81cD91B6BD7D275a7AeebBA15929AE0f0751d18C';
            this.WrappedCoinAddress = '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f';
            this.scanApiURL = 'https://api-goerli.arbiscan.io/api';
            break;
        case 84531:
            this.chainName = 'Base-Goerli';
            // this.scanApiKey = process.env.BASE_API_KEY;
            // this.scanRPCURL = process.env.BASE_GOERLI_RPC_URL;
            this.USDCProxyAddress = '0xf175520c52418dfe19c8098071a252da48cd1c19';
            this.USDCAddress = '0x057B113c020cA7Be92DE51591c2BcB99976F8A2c';
            this.RouterAddress = '0x9E3A2a71a5134EA25b547C3EE9131192da7B3DE5';
            this.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            this.scanApiURL = 'https://api-goerli.basescan.org/api';
            break;
    }
    // console.log(`chainName: ${this.chainName} & chainId: ${this.chainId}`);
    // console.log(`USDC Proxy address on the current chain: ${this.USDCProxyAddress}`)
    // console.log(`USDC address on the current chain: ${this.USDCAddress}`)
    // console.log(`scanApiURL: ${this.scanApiURL}`)
    await getCoinSymbol(chainId)

    console.info(initialGlobalData)

    return initialGlobalData
}

// 新增函数用于查询用户的代币余额
// async function getTokenBalances(provider, userAddress) {
//     try {
//         // 代币合约地址和 ABI，请根据实际情况替换
//         const tokenAddresses = {
//             ETH: "0x0000000000000000000000000000000000000000", // 以太坊的 ETH 地址
//             AVAX: "0x0000000000000000000000000000000000000000", // AVAX 代币地址
//             AGOR: "0x0000000000000000000000000000000000000000", // AGOR 代币地址
//             // 添加其他链上的代币地址
//         };
//
//         // 创建代币合约实例
//         for (const symbol in tokenAddresses) {
//             if (tokenAddresses.hasOwnProperty(symbol)) {
//                 const tokenContract = new ethers.Contract(tokenAddresses[symbol], ["function balanceOf(address) view returns (uint256)"], provider);
//                 const balance = await tokenContract.balanceOf(userAddress);
//                 initialGlobalData.tokenBalances[symbol] = balance.toString();
//                 console.log(`${symbol} 代币余额: ${balance.toString()}`);
//             }
//         }
//     } catch (error) {
//         console.error("查询代币余额出错:", error);
//     }
// }

// export async function switchChain() {
//     try {
//         await ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: '0xf00' }],
//         });
//     } catch (switchError) {
//         console.error(switchError)
//     }
// }

// export default async function connectWallet(accounts) {
//     if (window.ethereum) {
//         console.info("当前网络信息", window.ethereum)
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const network = await provider.getNetwork();
//             const chainId = network.chainId;
//             const chainName = network.name
//             const address = network.ensAddress
//             const balance = fetchBalance(accounts)
//
//             console.info("获取信息===============")
//             console.info("network:", network)
//             console.info("chainId:", chainId)
//             console.info("chainName:", chainName)
//             console.info("address:", address)
//             console.info("balance:", balance)
//             console.info("=================")
//
//             await initAccount()
//             await getCoinSymbol(chainId);
//             return initialGlobalData
//             // await getNetworkInfo(chainId);
//
//             // this.setState({ provider, chainId });
//         } catch (error) {
//             console.error("Error connecting to wallet:", error);
//         }
//     } else {
//         console.error("Need to install MetaMask.");
//     }
// }