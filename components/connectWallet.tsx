import { ethers } from "ethers";
import globalData from "@/models/globalData";
import { useSDK } from "@metamask/sdk-react";
import { SDKProvider } from "@metamask/sdk";
import getCoinPrice from "@/utils/getCoinPrice";
import getContractABI from "@/components/getContractABI";
import { err } from "pino-std-serializers";

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


const networkInfo: any = {
    chainName: '',
    USDCProxyAddress: '',
    USDCAddress: '',
    RouterAddress: '',
    WrappedCoinAddress: '',
    scanApiURL: '',
    scanApiKey: '',
    TokenMessengerAddr: '',
    MessageTransmitterAddr: '',
    scanURL: '',
    erc20Token: '',
    routerContract: '',
    TokenMessagerContract: '',
    coinPrice: '',
};

const contractInfo: any = {
    erc20Token: '',
    routerContract: '',
    TokenMessagerContract: '',
};

export function getCoinSymbol(chainId: number, networkInfo: any) {
    const ethChains = [1, 5, 10, 420, 42161, 8453, 84531];
    const avaxChains = [43114, 43113];
    const agorChains = [421613];

    if (ethChains.includes(chainId)) {
        networkInfo.coinSymbol = 'ETH';
        networkInfo.coinUSDCPair = 'ETHUSDT';
        const coinSymbol = 'ETH';
        const coinUSDCPair = 'ETHUSDT'
    } else if (avaxChains.includes(chainId)) {
        networkInfo.coinSymbol = 'AVAX';
        networkInfo.coinUSDCPair = 'AVAXUSDT';
    } else if (agorChains.includes(chainId)) {
        networkInfo.coinSymbol = 'AGOR';
        networkInfo.coinUSDCPair = 'ETHUSDT';
    } else {
        const errorMessage = 'Chain ID not recognized.';
        console.info(errorMessage);
    }
    console.info(networkInfo.coinSymbol, networkInfo.coinUSDCPair)
}

export async function getNetworkInfo(chainId: number) {

    const ETHERSCAN_API_KEY = "FG1HVQPZ313318ZH29Y6W7KSWB3XGAKMI9"
    const SNOWTRACE_API_KEY = "SZRTR9HGYY5CCC1UIA8TX2J4NGA8AFA3TZ"
    const OPTIMISMSCAN_API_KEY = "JG8ZQKKWN67NEGQQBF94E1J255NCUNZ1MP"
    switch (chainId) {
        // mainnet
        case 1:
            networkInfo.chainName = 'Ethereum Mainnet' //'Ethereum Mainnet';
            networkInfo.scanApiKey = 'FG1HVQPZ313318ZH29Y6W7KSWB3XGAKMI9';
            // networkInfo.scanRPCURL = process.apikey.tsx.ETHEREUM_RPC_URL;
            networkInfo.USDCProxyAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
            networkInfo.USDCAddress = '0xa2327a938Febf5FEC13baCFb16Ae10EcBc4cbDCF';
            networkInfo.RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
            networkInfo.WrappedCoinAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
            networkInfo.TokenMessengerAddr = '0xbd3fa81b58ba92a82136038b25adec7066af3155';
            networkInfo.MessageTransmitterAddr = '0x0a992d191deec32afe36203ad87d7d289a738f81';
            networkInfo.scanApiURL = 'https://api.etherscan.io/api';
            networkInfo.scanURL = 'https://etherscan.io/';
            break;
        case 43114:
            networkInfo.chainName = 'Avalanche C-Chain';
            networkInfo.scanApiKey = 'SZRTR9HGYY5CCC1UIA8TX2J4NGA8AFA3TZ';
            // networkInfo.scanRPCURL = process.apikey.tsx.AVALANCHE_RPC_URL;
            networkInfo.USDCProxyAddress = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
            networkInfo.USDCAddress = '0xa3fa3D254bf6aF295b5B22cC6730b04144314890';
            networkInfo.RouterAddress = '0x60ae616a2155ee3d9a68541ba4544862310933d4';
            networkInfo.WrappedCoinAddress = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
            networkInfo.TokenMessengerAddr = '0x6b25532e1060ce10cc3b0a99e5683b91bfde6982';
            networkInfo.MessageTransmitterAddr = '0x8186359af5f57fbb40c6b14a588d2a59c0c29880';
            networkInfo.scanApiURL = 'https://api.snowtrace.io/api';
            networkInfo.scanURL = 'https://snowtrace.io/';
            break;
        case 10:
            networkInfo.chainName = 'Optimism Mainnet';
            networkInfo.scanApiKey = 'JG8ZQKKWN67NEGQQBF94E1J255NCUNZ1MP';
            // networkInfo.scanRPCURL = process.apikey.tsx.OPTIMISM_RPC_URL;
            networkInfo.USDCProxyAddress = '0x0b2c639c533813f4aa9d7837caf62653d097ff85';
            networkInfo.USDCAddress = '0xbd17DEee53a58B48548117a11a2E7bbF2D0d6Fa7';
            networkInfo.RouterAddress = '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858';
            networkInfo.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            networkInfo.TokenMessengerAddr = '0x2B4069517957735bE00ceE0fadAE88a26365528f';
            networkInfo.MessageTransmitterAddr = '0x4d41f22c5a0e5c74090899e5a8fb597a8842b3e8';
            networkInfo.scanApiURL = 'https://api-optimistic.etherscan.io/api';
            networkInfo.scanURL = 'https://optimistic.etherscan.io/';
            break;
        case 42161:
            networkInfo.chainName = 'Arbitrum One';
            networkInfo.scanApiKey = process.env.ARBISCAN_API_KEY;
            // networkInfo.scanRPCURL = process.apikey.tsx.ARBITRUM_RPC_URL;
            networkInfo.USDCProxyAddress = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
            networkInfo.USDCAddress = '0x0f4fb9474303d10905AB86aA8d5A65FE44b6E04A';
            networkInfo.RouterAddress = '0xbeE5c10Cf6E4F68f831E11C1D9E59B43560B3642';
            networkInfo.WrappedCoinAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
            networkInfo.TokenMessengerAddr = '0x19330d10D9Cc8751218eaf51E8885D058642E08A';
            networkInfo.MessageTransmitterAddr = '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca';
            networkInfo.scanApiURL = 'https://api.arbiscan.io/api';
            networkInfo.scanURL = 'https://arbiscan.io/';
            break;
        case 8453:
            networkInfo.chainName = 'Base';
            this.scanApiKey = process.env.BASE_API_KEY;
            // this.scanRPCURL = process.apikey.tsx.BASE_RPC_URL;
            networkInfo.USDCProxyAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
            networkInfo.USDCAddress = '0x6D0c9A70D85E42Ba8B76dc06620d4E988ec8D0C1';
            networkInfo.RouterAddress = '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86';
            networkInfo.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            networkInfo.TokenMessengerAddr = '0x1682Ae6375C4E4A97e4B583BC394c861A46D8962';
            networkInfo.MessageTransmitterAddr = '0xAD09780d193884d503182aD4588450C416D6F9D4';
            networkInfo.scanApiURL = 'https://api.basescan.org/api';
            networkInfo.scanURL = 'https://basescan.org/';
            break;
        // testnet
        case 5:
            networkInfo.chainName = 'Ethereum-Goerli';
            networkInfo.scanApiKey = 'FG1HVQPZ313318ZH29Y6W7KSWB3XGAKMI9';
            // networkInfo.scanRPCURL = process.apikey.tsx.ETHEREUM_GOERLI_RPC_URL;
            networkInfo.USDCProxyAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F';
            networkInfo.USDCAddress = '0xe27658a36cA8A59fE5Cc76a14Bde34a51e587ab4';
            networkInfo.RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
            networkInfo.WrappedCoinAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
            networkInfo.TokenMessengerAddr = '0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8';
            networkInfo.MessageTransmitterAddr = '0x26413e8157cd32011e726065a5462e97dd4d03d9';
            networkInfo.scanApiURL = 'https://api-goerli.etherscan.io/api';
            networkInfo.scanURL = 'https://goerli.etherscan.io/';
            break;
        case 43113:
            networkInfo.chainName = 'Avalanche-Fuji';
            networkInfo.scanApiKey = 'SZRTR9HGYY5CCC1UIA8TX2J4NGA8AFA3TZ';
            // networkInfo.scanRPCURL = process.apikey.tsx.AVALANCHE_FUJI_RPC_URL;
            networkInfo.USDCProxyAddress = '0x5425890298aed601595a70ab815c96711a31bc65';
            networkInfo.USDCAddress = '0x79beb0a978443dBc125599170332b3F40D448F63';
            networkInfo.RouterAddress = '0x3705aBF712ccD4fc56Ee76f0BD3009FD4013ad75';
            networkInfo.WrappedCoinAddress = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c';
            networkInfo.TokenMessengerAddr = '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0';
            networkInfo.MessageTransmitterAddr = '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79';
            networkInfo.scanApiURL = 'https://api-testnet.snowtrace.io/api';
            networkInfo.scanURL = 'https://testnet.snowtrace.io/';
            break;
        case 420:
            networkInfo.chainName = 'Optimism-Goerli';
            networkInfo.scanApiKey = 'JG8ZQKKWN67NEGQQBF94E1J255NCUNZ1MP';
            // networkInfo.scanRPCURL = process.apikey.tsx.OPTIMISM_GOERLI_RPC_URL;
            networkInfo.USDCProxyAddress = '0xe05606174bac4a6364b31bd0eca4bf4dd368f8c6';
            networkInfo.USDCAddress = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85';
            networkInfo.RouterAddress = '0x8F1f2A89930dC9aaa7B5a799AC695dF809B0fbe5';
            networkInfo.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            networkInfo.TokenMessengerAddr = '0x23a04d5935ed8bc8e3eb78db3541f0abfb001c6e';
            networkInfo.MessageTransmitterAddr = '0x9ff9a4da6f2157a9c82ce756f8fd7e0d75be8895';
            networkInfo.scanApiURL = 'https://api-goerli-optimistic.etherscan.io/api';
            networkInfo.scanURL = 'https://goerli-optimistic.etherscan.io/';
            break;
        case 421613:
            networkInfo.chainName = 'Arbitrum-Goerli';
            networkInfo.scanApiKey = process.env.ARBISCAN_API_KEY;
            // networkInfo.scanRPCURL = process.apikey.tsx.ARBITRUM_GOERLI_RPC_URL;
            networkInfo.USDCProxyAddress = '0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63';
            networkInfo.USDCAddress = '0xC042E9E8cE7eB153a9B3113F91ABbF1065dfC44e';
            networkInfo.RouterAddress = '0x81cD91B6BD7D275a7AeebBA15929AE0f0751d18C';
            networkInfo.WrappedCoinAddress = '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f';
            networkInfo.TokenMessengerAddr = '0x12dcfd3fe2e9eac2859fd1ed86d2ab8c5a2f9352';
            networkInfo.MessageTransmitterAddr = '0x109bc137cb64eab7c0b1dddd1edf341467dc2d35';
            networkInfo.scanApiURL = 'https://api-goerli.arbiscan.io/api';
            networkInfo.scanURL = 'https://goerli.arbiscan.io/';
            break;
        case 84531:
            networkInfo.chainName = 'Base-Goerli';
            networkInfo.scanApiKey = process.env.BASE_API_KEY;
            // networkInfo.scanRPCURL = process.apikey.tsx.BASE_GOERLI_RPC_URL;
            networkInfo.USDCProxyAddress = '0xf175520c52418dfe19c8098071a252da48cd1c19';
            networkInfo.USDCAddress = '0x057B113c020cA7Be92DE51591c2BcB99976F8A2c';
            networkInfo.RouterAddress = '0x9E3A2a71a5134EA25b547C3EE9131192da7B3DE5';
            networkInfo.WrappedCoinAddress = '0x4200000000000000000000000000000000000006';
            networkInfo.TokenMessengerAddr = '0x877b8e8c9e2383077809787ED6F279ce01CB4cc8';
            networkInfo.MessageTransmitterAddr = '0x9ff9a4da6f2157A9c82CE756f8fD7E0d75be8895';
            networkInfo.scanApiURL = 'https://api-goerli.basescan.org/api';
            networkInfo.scanURL = 'https://goerli.basescan.org/';
            break;
    }

    getCoinSymbol(chainId, networkInfo)

    return networkInfo
}

export async function initContract(USDCProxyAddress: any, scanApiURL: any, USDCAddress: any, scanApiKey: any, RouterAddress: any, TokenMessengerAddr: any) {
    try {
        console.info(USDCProxyAddress, scanApiURL, USDCAddress, scanApiKey, RouterAddress, TokenMessengerAddr)
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        contractInfo.erc20Token = new ethers.Contract(USDCProxyAddress, await getContractABI(scanApiURL, USDCAddress, scanApiKey), signer);
        contractInfo.routerContract = new ethers.Contract(RouterAddress, await getContractABI(scanApiURL, RouterAddress, scanApiKey), signer);
        contractInfo.TokenMessagerContract = new ethers.Contract(TokenMessengerAddr, await getContractABI(scanApiURL, TokenMessengerAddr, scanApiKey), signer);
    } catch (e) {
        console.error(e)
    }

    return contractInfo
}

export async function readContract(erc20Token: any, account: any) {
    console.info("我在读取合约")
    console.info("当前的地址", account)
    const USDCTokenInfo: any = {
        name: "",
        decimal: "",
        symbol: "",
        supply: "",
        tokenBalance: "",
    }
    try {
        USDCTokenInfo.name = await erc20Token.name();
        USDCTokenInfo.decimal = await erc20Token.decimals();
        USDCTokenInfo.symbol = await erc20Token.symbol();
        const totalSupply = await erc20Token.totalSupply();
        USDCTokenInfo.supply = ethers.utils.formatUnits(totalSupply, USDCTokenInfo.decimal);
        const balance = await erc20Token.balanceOf(account);
        USDCTokenInfo.tokenBalance = ethers.utils.formatUnits(balance, USDCTokenInfo.decimal);
        // await contractInfo.erc20Token.name().then((r) => {
        //     USDCTokenInfo.name = r;
        // })
        // await contractInfo.erc20Token.decimals().then((r) => {
        //     USDCTokenInfo.decimal = r;
        // })
        // await contractInfo.erc20Token.symbol().then((r) => {
        //     USDCTokenInfo.symbol = r;
        // })
        // await contractInfo.erc20Token.totalSupply().then((r) => {
        //     USDCTokenInfo.supply = ethers.utils.formatUnits(r, USDCTokenInfo.decimal);
        // })
        //
        // await contractInfo.erc20Token.balanceOf(account).then((r) => {
        //     USDCTokenInfo.tokenBalance = ethers.utils.formatUnits(r, USDCTokenInfo.decimal);
        // })
    } catch (e) {
        console.error("readContract error", e)
    }


    return USDCTokenInfo
}


export async function connectMetaMask() {
    if (window.ethereum) { // 检查 window.ethereum 是否存在
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // 连接成功后，accounts 变量将包含用户钱包地址的数组
        return accounts
    } else {
        // 如果 window.ethereum 不存在，提示用户安装 MetaMask
        return "Please install MetaMask!"
    }
}
