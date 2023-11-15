import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button, Divider, Input, Link, Select, SelectItem, Slider } from "@nextui-org/react";
import { Down } from "@icon-park/react";
import { useMetaMask } from "@/hooks/useMetaMask";
import React, { useEffect, useState } from "react";
import network = chrome.privacy.network;
import switchNetwork from "@/components/switchNetwork";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAddress,
    selectBalance,
    selectChainID,
    selectChainName,
    selectCoinPrice,
    selectCoinSymbol,
    selectCoinUSDCPair, selectErc20Token, selectIsFinished, selectMessageTransmitterAddr,
    selectRouterAddress,
    selectScanApiKey,
    selectScanApiURL, selectScanURLL,
    selectTokenMessengerAddr,
    selectUSDCAddress,
    selectUSDCProxyAddress, selectUSDCTokenInfo,
    selectWrappedCoinAddress,
    setChainID,
    setChainName,
    setCoinPrice,
    setCoinSymbol,
    setCoinUSDCPair, setIsFinished,
    setMessageTransmitterAddr,
    setRouterAddress, setScanApiKey, setScanApiURL, setScanURLL,
    setTokenMessengerAddr,
    setUSDCAddress,
    setUSDCProxyAddress,
    setWrappedCoinAddress
} from "@/redux/store";
import { formatChainAsHex, formatChainAsNum } from "@/utils/formot";
import { getNetworkInfo, initContract, readContract } from "@/components/connectWallet";
import getCoinPrice from "@/utils/getCoinPrice";
import swapEstimate from "@/utils/swapEstimate";
import { err } from "pino-std-serializers";
import swapExactCoinForToken from "@/components/swapExactCoinForToken";

function NetworkImage(img: string) {
    return (
        <div className="flex flex-row items-center justify-center">
            <img src={img} className="w-5 h-5" alt="network"/>
        </div>
    )
}

function isMobileDevice() {
    if (typeof window !== "undefined") {
        console.info("检测设备");
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
    }
    return false;
}


const tokens = [
    { label: "USDC", value: "USDC", description: "The second most popular pet in the world" },
    { label: "BNB", value: "BNB", description: "The most popular pet in the world" },
    { label: "ETH", value: "ETH", description: "The largest land animal" },
];

export default function SwapCard() {
    const networks = [
        {
            chainID: 1,
            chainName: "Ethereum Mainnet",
            img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
            rpcUrl: "https://eth.llamarpc.com\t"
        },
        {
            chainID: 43114,
            chainName: "Avalanche C-Chain",
            img: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
            rpcUrl: "https://avalanche.drpc.org"
        },
        {
            chainID: 10,
            chainName: "Optimism Mainnet",
            img: "https://assets-global.website-files.com/611dbb3c82ba72fbc285d4e2/611fd32ddac3c1856c306c37_optimism%20logo%20icon.svg",
            rpcUrl: "https://avalanche.drpc.org"
        },
        {
            chainID: 42161,
            chainName: "Arbitrum One",
            img: "https://l2beat.com/icons/arbitrum.png",
            rpcUrl: "https://1rpc.io/arb"
        },
        {
            chainID: 8453,
            chainName: "Base",
            img: "https://chainid.network/static/8bf043c4eab7887a7504aa3cea79e55d/e73fe/base.webp",
            rpcUrl: "https://base-pokt.nodies.app"
        },
        {
            chainID: 5,
            chainName: "Ethereum Goerli Testnet",
            img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
            rpcUrl: "https://ethereum-goerli.publicnode.com"
        },
        {
            chainID: 43113,
            chainName: "Avalanche Fuji Testnet",
            img: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
            rpcUrl: "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc"
        },
        {
            chainID: 420,
            chainName: "Optimism Goerli Testnet",
            img: "https://assets-global.website-files.com/611dbb3c82ba72fbc285d4e2/611fd32ddac3c1856c306c37_optimism%20logo%20icon.svg",
            rpcUrl: "https://optimism-goerli.public.blastapi.io"
        },
        { chainID: 421613, chainName: "Arbitrum Goerli Testnet", img: "https://l2beat.com/icons/arbitrum.png" },
        {
            chainID: 84531,
            chainName: "Base Goerli Testnet",
            img: "https://chainid.network/static/8bf043c4eab7887a7504aa3cea79e55d/e73fe/base.webp",
            rpcUrl: "https://base-goerli.publicnode.com"
        },
    ];
    const address = false
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

    // 全局变量
    const dispatch = useDispatch();
    const account = useSelector(selectAddress)
    const chainName = useSelector(selectChainName);
    const coinSymbol = useSelector(selectCoinSymbol);
    const chainID = useSelector(selectChainID)
    const scanURLL = useSelector(selectScanURLL)
    const coinPrice = useSelector(selectCoinPrice);
    const coinUSDCPair = useSelector(selectCoinUSDCPair);
    const balance = useSelector(selectBalance)
    const wrappedCoinAddress = useSelector(selectWrappedCoinAddress)
    const USDCProxyAddress = useSelector(selectUSDCProxyAddress)
    const USDCAddress = useSelector(selectUSDCAddress)
    const scanApiURL = useSelector(selectScanApiURL)
    const scanApiKey = useSelector(selectScanApiKey)
    const routerAddress = useSelector(selectRouterAddress)
    const tokenMessengerAddr = useSelector(selectTokenMessengerAddr)
    const isFinished = useSelector(selectIsFinished)
    const erc20Token = useSelector(selectErc20Token)
    const messageTransmitterAddr = useSelector(selectMessageTransmitterAddr)
    const routerContract = useSelector(selectRouterAddress)
    const USDCTokenInfo = useSelector(selectUSDCTokenInfo)


    const onSwitchNetwork = async (chainID: any, rpcUrl: any, chainName: any) => {
        setLoading(true)
        switchNetwork(chainID, rpcUrl, chainName)
        console.info("即将切换全局变量", chainName, chainID, chainName)
        dispatch(setChainName(chainName))
        dispatch(setChainID(chainID))
        console.info("格式化", formatChainAsHex(chainID))
        const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
        });
        getNetworkInfo(chainID).then(
            async (res) => {
                dispatch(setCoinUSDCPair(res.coinUSDCPair))
                dispatch(setCoinSymbol(res.coinSymbol))
                dispatch(setChainName(res.chainName))
                dispatch(setCoinUSDCPair(res.coinUSDCPair))
                dispatch(setUSDCProxyAddress(res.USDCProxyAddress))
                dispatch(setUSDCAddress(res.USDCAddress))
                dispatch(setRouterAddress(res.RouterAddress))
                dispatch(setWrappedCoinAddress(res.WrappedCoinAddress))
                dispatch(setTokenMessengerAddr(res.TokenMessengerAddr))
                dispatch(setMessageTransmitterAddr(res.MessageTransmitterAddr))
                dispatch(setScanApiURL(res.scanApiURL))
                dispatch(setScanURLL(res.scanURLL))
                dispatch(setScanApiKey(res.scanApiKey))
                dispatch(setIsFinished(true))
                getCoinPrice(res.coinUSDCPair).then(
                    (res) => {
                        console.info("当前价格", res)
                        dispatch(setCoinPrice(res))
                    }
                ).finally(() => setLoading(false))
                await initContract(
                    USDCProxyAddress,
                    scanApiURL,
                    USDCAddress,
                    scanApiKey,
                    routerAddress,
                    tokenMessengerAddr).then(
                    (res) => {
                        console.info(res)
                        dispatch(selectErc20Token(res.erc20Token))
                        dispatch(selectRouterAddress(res.routerContract))
                        dispatch(selectTokenMessengerAddr(res.TokenMessagerContract))
                    }
                )
                await readContract(erc20Token, account).then(
                    (res) => {
                        console.info(res)
                        dispatch(selectUSDCTokenInfo(res))
                    })
            }
        )
    }
    // 处理输入输出
    const [amountInForSwap, setAmountInForSwap] = useState<any>('')
    const [swapEstimateOut, setSwapEstimateOut] = useState<any>()
    const [slippage, setSlippage] = useState<any>()

    // const handleInputChange = (e) => {
    //     setAmountInForSwap(e.target.value);
    //     setSwapEstimateOut(amountInForSwap * 10)
    //     // await swapEstimate(amountInForSwap, slippage, wrappedCoinAddress, USDCProxyAddress)
    // };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        console.info("target", inputValue);

        // 判断是否为空字符串，如果是则设置为0
        const newAmountInForSwap = inputValue === '' ? 0 : inputValue;
        setAmountInForSwap(newAmountInForSwap);
    };

    const [contractInfo, setContractInfo] = useState<any>()

    // 处理输入输出
    async function fetchEstimate() {
        try {
            await swapEstimate(
                amountInForSwap,
                slippage,
                wrappedCoinAddress,
                USDCProxyAddress,
                contractInfo.routerContract,
                USDCTokenInfo.decimal
            ).then(
                (res) => {
                    console.info(res)
                    setSwapEstimateOut(res)
                }
            )
        } catch (e) {
            console.error(e)
        }
    }

    const fetchData = async () => {
        console.info("我在获取合约信息")
        await initContract(
            USDCProxyAddress,
            scanApiURL,
            USDCAddress,
            scanApiKey,
            routerAddress,
            tokenMessengerAddr).then(
            (res) => {
                console.info(res)
                setContractInfo(res)
            }
        )
        await readContract(erc20Token, account).then(
            (res) => {
                console.info(res)
                dispatch(selectUSDCTokenInfo(res))
            })
    }
    // useEffect(() => {
    //     if (isFinished) {
    //         // 等待5s
    //         setTimeout(() => {
    //             fetchData()
    //         }, 5000)
    //     }
    // }, [chainID, chainName])

    useEffect(() => {
        console.info(amountInForSwap);
        try {
            fetchEstimate()
        } catch (e) {
            console.error(e)
        }
    }, [amountInForSwap, slippage]);

    const handleSlippageChange = (e) => {
        setSlippage(e)
    }

    const [reply, setReply] = useState()
    const useSwapExactCoinForToken = () => {
        swapExactCoinForToken(
            true,
            amountInForSwap,
            account,
            account,
            wrappedCoinAddress,
            USDCProxyAddress,
            swapEstimateOut,
            contractInfo.routerContract,
            scanURLL,
            USDCTokenInfo.decimal,
            chainID,
            contractInfo
        ).then(
            (res) => {
                setReply(res)
            }
        )
    }

    return (
        <div className="flex flex-col items-center justify-center mx-3">
            <Card
                className="w-full mt-5 sm:mt-20 md:w-[50%] lg:w-[55%] justify-center"
            >
                <CardHeader>
                    Swap
                </CardHeader>
                <Divider/>
                <CardBody>
                    <div>
                        {isMobile ? (<>
                                <div className="flex flex-row space-x-4 mt-5">
                                    <Select
                                        items={networks}
                                        color="primary"
                                        label="From Chain"
                                        placeholder="Select Chain"
                                        size="lg"
                                        radius="full"
                                        renderValue={(items) => {
                                            return items.map((item) => (
                                                // eslint-disable-next-line react/jsx-key
                                                <div className="flex flex-row">
                                                    <img src={item.data.img} className="w-5 h-5" alt="network"/>
                                                    <span>{item.data.chainName}</span>
                                                </div>
                                            ))
                                        }}
                                    >
                                        {(network) => (
                                            <SelectItem
                                                key={network.chainID}
                                                value={network.chainName}
                                                startContent={<>{NetworkImage(network.img)}</>}
                                            >
                                                {network.chainName}
                                            </SelectItem>
                                        )}
                                    </Select>
                                </div>
                                <div className="flex flex-row space-x-4 mt-5">
                                    <Select
                                        items={networks}
                                        color="danger"
                                        label="To Chain"
                                        placeholder="Select Chain"
                                        size="lg"
                                        radius="full"
                                        renderValue={(items) => {
                                            return items.map((item) => (
                                                // eslint-disable-next-line react/jsx-key
                                                <div className="flex flex-row">
                                                    <img src={item.data.img} className="w-5 h-5" alt="network"/>
                                                    <span>{item.data.chainName}</span>
                                                </div>
                                            ))
                                        }}
                                    >
                                        {(network) => (
                                            <SelectItem
                                                key={network.chainID}
                                                value={network.chainName}
                                                startContent={<>{NetworkImage(network.img)}</>}
                                            >
                                                {network.chainName}
                                            </SelectItem>
                                        )}
                                    </Select>
                                </div>
                                <div className="mt-5 content-center items-center justify-center">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-2">
                                            <Input
                                                size="lg"
                                                label="You Pay"
                                                className="w-7/12"
                                            />
                                            <Select
                                                label="Token"
                                                defaultSelectedKeys={["USDC"]}
                                                size="lg"
                                                radius="sm"
                                                className="w-5/12"
                                            >
                                                {tokens.map((token) => (
                                                    <SelectItem key={token.value} value={token.value}>
                                                        {token.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        {address && typeof address === 'string' ? (
                                            <div className="flex flex-row gap-1 mt-0.5">
                                            <span className="text-sm text-gray-500">
                                                Current Address : {address}
                                            </span>
                                            </div>
                                        ) : <></>}

                                    </div>
                                    <div className="flex w-full flex-col items-center mt-1 mb-1">
                                        <Down theme="multi-color" size="30"
                                              fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                                              strokeWidth={2} strokeLinecap="square"/>
                                    </div>
                                    <Input size="lg" label="You Receive"/>
                                </div>
                            </>
                        ) : <>
                            <div className="flex flex-row space-x-4 mt-5">
                                <Select
                                    items={networks}
                                    color="primary"
                                    label="From Chain"
                                    placeholder="Select Chain"
                                    size="lg"
                                    radius="full"
                                    renderValue={(items) => {
                                        return items.map((item) => (
                                            <div className="flex flex-row" key={item.data.chainID}>
                                                <img src={item.data.img} className="w-5 h-5" alt="network"/>
                                                <span>{item.data.chainName}</span>
                                            </div>
                                        ))
                                    }}
                                >
                                    {(network) => (
                                        <SelectItem
                                            key={network.chainID}
                                            value={network.chainName}
                                            startContent={<>{NetworkImage(network.img)}</>}
                                            onClick={() => onSwitchNetwork(network.chainID, network.rpcUrl, network.chainName)
                                            }
                                        >
                                            {network.chainName}
                                        </SelectItem>
                                    )}
                                </Select>
                                <Select
                                    items={networks}
                                    color="danger"
                                    label="To Chain"
                                    placeholder="Select Chain"
                                    size="lg"
                                    radius="full"
                                    renderValue={(items) => {
                                        return items.map((item) => (
                                            // eslint-disable-next-line react/jsx-key
                                            <div className="flex flex-row">
                                                <img src={item.data.img} className="w-5 h-5" alt="network"/>
                                                <span>{item.data.chainName}</span>
                                            </div>
                                        ))
                                    }}
                                    isDisabled={true}
                                >
                                    {(network) => (
                                        <SelectItem
                                            key={network.chainID}
                                            value={network.chainName}
                                            startContent={<>{NetworkImage(network.img)}</>}
                                            isDisabled={true}
                                        >
                                            {network.chainName}
                                        </SelectItem>
                                    )}
                                </Select>
                            </div>
                            <div className="mt-10 content-center items-center justify-center">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2">
                                        <Input
                                            size="lg"
                                            label="You Pay"
                                            endContent={<>{!balance ? <></> :
                                                <span>Balance:{balance}{coinSymbol}</span>}</>}
                                            onChange={handleInputChange}
                                        />
                                        <Button
                                            onClick={fetchData}
                                        >
                                            test
                                        </Button>
                                    </div>
                                    <div className="flex flex-row mt-5 w-full">
                                        <Slider
                                            label="Slippage"
                                            step={0.01}
                                            maxValue={1}
                                            minValue={0}
                                            defaultValue={0.4}
                                            radius={"md"}
                                            showOutline={true}
                                            classNames={{
                                                track: "border-s-blue-100",
                                                filler: "bg-gradient-to-r from-blue-100 to-blue-500"
                                            }}
                                            onChange={handleSlippageChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full flex-col items-center mt-3 mb-3">
                                    <Down theme="multi-color" size="30" fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                                          strokeWidth={2} strokeLinecap="square"/>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2">
                                        <Input
                                            size="lg"
                                            label="You Receive"
                                            value={swapEstimateOut ? swapEstimateOut.toString() : ""}
                                        />
                                        <Select
                                            label="Token"
                                            defaultSelectedKeys={["USDC"]}
                                            size="lg"
                                            radius="sm"
                                            className="w-2/5"
                                        >
                                            {tokens.map((token) => (
                                                <SelectItem key={token.value} value={token.value}>
                                                    {token.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>
                </CardBody>
                <div className="flex flex-col mx-5 mb-5 mt-5">
                    <Button color="primary" size="lg" onClick={useSwapExactCoinForToken}>
                        Primary
                    </Button>
                    {reply ? <Link href={reply}></Link> : <></>}
                </div>
            </Card>
        </div>
    )
}