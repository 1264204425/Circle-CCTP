import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Unlink } from "@icon-park/react";
import { connectMetaMask, getNetworkInfo, initContract, readContract } from "@/components/connectWallet";
import { useSDK } from "@metamask/sdk-react";
import { formatAddress, formatBalance, formatChainAsNum } from "@/utils/formot";
import globalData from "@/models/globalData";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAddress,
    selectBalance,
    selectChainID,
    selectChainName,
    selectCoinPrice,
    selectCoinSymbol,
    selectCoinUSDCPair,
    selectErc20Token,
    selectIsFinished,
    selectMessageTransmitterAddr,
    selectRouterAddress,
    selectScanApiKey,
    selectScanApiURL,
    selectScanURLL,
    selectTokenMessengerAddr,
    selectUSDCAddress,
    selectUSDCProxyAddress, selectUSDCTokenInfo,
    selectWrappedCoinAddress,
    setAddress,
    setBalance,
    setChainID,
    setChainName,
    setCoinPrice,
    setCoinSymbol,
    setCoinUSDCPair,
    setIsFinished,
    setMessageTransmitterAddr,
    setRouterAddress,
    setScanApiKey,
    setScanApiURL,
    setScanURLL,
    setTokenMessengerAddr,
    setUSDCAddress,
    setUSDCProxyAddress,
    setWrappedCoinAddress
} from "@/redux/store";
import getCoinPrice from "@/utils/getCoinPrice";

export default function ConnectButton() {

    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState<any>()
    const [networkInfo, setNetworkInfo] = useState(null)

    // metamask
    const { sdk, connected, connecting, provider } = useSDK();

    // 全局变量
    const dispatch = useDispatch();
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


    const onConnectMetaMask = async () => {
        try {
            const accounts = sdk?.connect()
            setAccount(accounts[0])
            setLoading(true)

            if (account) {
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [account, 'latest']
                });
                console.info(balance);
                dispatch(setAddress(account)) // redux
                dispatch(setBalance(formatBalance(typeof balance === "string" ? balance : balance.toString())));

                let chainID: any = await window.ethereum.request({ method: 'eth_chainId' });
                console.info(chainID);
                console.info("格式化后的", formatChainAsNum(chainID))
                dispatch(setChainID(formatChainAsNum(chainID)))

                setNetworkInfo(await getNetworkInfo(formatChainAsNum(chainID)));
                await getNetworkInfo(formatChainAsNum(chainID)).then(
                    (res) => {
                        console.info(res)
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
                        dispatch(setScanURLL(res.scanURL))
                        dispatch(setScanApiKey(res.scanApiKey))
                        dispatch(setIsFinished(true))
                    }
                )
                console.info("***********************************")
                console.info(USDCProxyAddress, scanApiURL, USDCAddress, scanApiKey, routerAddress, tokenMessengerAddr)
                // await initContract(
                //     USDCProxyAddress,
                //     scanApiURL,
                //     USDCAddress,
                //     scanApiKey,
                //     routerAddress,
                //     tokenMessengerAddr).then(
                //     async (res) => {
                //         console.info("***********************************")
                //         console.info(res)
                //         console.info(res.erc20Token)
                //         dispatch(selectErc20Token(res.erc20Token))
                //         dispatch(selectRouterAddress(res.routerContract))
                //         dispatch(selectTokenMessengerAddr(res.TokenMessagerContract))
                //         await readContract(res.erc20Token, account).then(
                //             (res) => {
                //                 console.info(res)
                //                 dispatch(selectUSDCTokenInfo(res))
                //             })
                //     }
                // )
                // console.info("***********************************")
                // console.info(erc20Token)
                await getCoinPrice(coinUSDCPair).then(
                    (res) => {
                        console.info("当前价格", res)
                        dispatch(setCoinPrice(res))
                    }
                )
            }
        } catch (error) {
            sdk?.terminate()
            console.error(error);
        } finally {
            setLoading(false)
        }
    }
    const onDisconnectMetaMask = () => {
        // 断开连接
        sdk?.terminate()
        setAccount("")
    };

    useEffect(() => {
        if (chainName) {
            getCoinPrice(coinUSDCPair).then(
                (res) => {
                    console.info("当前价格", res)
                    dispatch(setCoinPrice(res))
                }
            )
        }
    }, []);

    return (
        <>
            {loading ?
                (<>
                    <Button
                        color="primary"
                        variant="flat"
                        size="md"
                        onClick={onConnectMetaMask}
                        isDisabled={true}
                        isLoading={loading}
                    >
                        Connect Wallet
                    </Button>
                </>) :
                (<>
                    {account && balance ? (<>
                            <div className="flex flex-col items-center">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="shadow"
                                            color="primary"
                                        >
                                            {account}
                                            {account.substring(0, 8)}...{account.substring(account.length - 8)}
                                            {/*Wallet*/}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem
                                            key="chainName"
                                            isDisabled={true}
                                            textValue={"chainName"}
                                        >
                                            <div className="flex flex-row">
                                                <span>Network: </span>
                                                <span>{chainName}</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="coinPrice"
                                            isDisabled={true}
                                            textValue={"coinPrice"}
                                        >
                                            <div className="flex flex-row">
                                                <span>{coinSymbol} Price:{coinPrice ? coinPrice : "Error Restart..."}</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="address"
                                            isDisabled={true}
                                            textValue={account && `${account.substring(0, 5)}...${account.substring(account.length - 5)}`}
                                        >
                                            <div className="flex flex-row">
                                                <span>Address: </span>
                                                <span>{account && `${account.substring(0, 5)}...${account.substring(account.length - 5)}`}</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="balance"
                                            isDisabled={true}
                                            textValue={balance}
                                        >
                                            <div className="flex flex-row">
                                                <span>Balance: </span>
                                                <span>{balance}{coinSymbol}</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                            onClick={onDisconnectMetaMask}
                                            textValue={"Disconnect"}
                                            startContent={<Unlink theme="multi-color" size="20"
                                                                  fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                                                                  strokeWidth={2} strokeLinecap="square"/>}>
                                            <div className="flex flex-row">
                                                Disconnect
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </>) :
                        (<>
                            <Button
                                color="primary"
                                variant="flat"
                                size="md"
                                onClick={onConnectMetaMask}
                                // onClick={connectWallet}
                                startContent={<img
                                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zOmV2PSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHMiCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMTguNiAzMTguNiIKCSBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMTguNiAzMTguNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNFMjc2MUI7c3Ryb2tlOiNFMjc2MUI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KCS5zdDF7ZmlsbDojRTQ3NjFCO3N0cm9rZTojRTQ3NjFCO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9Cgkuc3Qye2ZpbGw6I0Q3QzFCMztzdHJva2U6I0Q3QzFCMztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQoJLnN0M3tmaWxsOiMyMzM0NDc7c3Ryb2tlOiMyMzM0NDc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KCS5zdDR7ZmlsbDojQ0Q2MTE2O3N0cm9rZTojQ0Q2MTE2O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9Cgkuc3Q1e2ZpbGw6I0U0NzUxRjtzdHJva2U6I0U0NzUxRjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQoJLnN0NntmaWxsOiNGNjg1MUI7c3Ryb2tlOiNGNjg1MUI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KCS5zdDd7ZmlsbDojQzBBRDlFO3N0cm9rZTojQzBBRDlFO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9Cgkuc3Q4e2ZpbGw6IzE2MTYxNjtzdHJva2U6IzE2MTYxNjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fQoJLnN0OXtmaWxsOiM3NjNEMTY7c3Ryb2tlOiM3NjNEMTY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30KPC9zdHlsZT4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIyNzQuMSwzNS41IDE3NC42LDEwOS40IDE5Myw2NS44ICIvPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNDQuNCwzNS41IDE0My4xLDExMC4xIDEyNS42LDY1LjggCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIyMzguMywyMDYuOCAyMTEuOCwyNDcuNCAyNjguNSwyNjMgMjg0LjgsMjA3LjcgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIzMy45LDIwNy43IDUwLjEsMjYzIDEwNi44LDI0Ny40IDgwLjMsMjA2LjggCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMDMuNiwxMzguMiA4Ny44LDE2Mi4xIDE0NC4xLDE2NC42IDE0Mi4xLDEwNC4xIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMjE0LjksMTM4LjIgMTc1LjksMTAzLjQgMTc0LjYsMTY0LjYgMjMwLjgsMTYyLjEgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMDYuOCwyNDcuNCAxNDAuNiwyMzAuOSAxMTEuNCwyMDguMSAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjE3Ny45LDIzMC45IDIxMS44LDI0Ny40IDIwNy4xLDIwOC4xIAkiLz4KPC9nPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDIiIHBvaW50cz0iMjExLjgsMjQ3LjQgMTc3LjksMjMwLjkgMTgwLjYsMjUzIDE4MC4zLDI2Mi4zIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDIiIHBvaW50cz0iMTA2LjgsMjQ3LjQgMTM4LjMsMjYyLjMgMTM4LjEsMjUzIDE0MC42LDIzMC45IAkiLz4KPC9nPgo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjEzOC44LDE5My41IDExMC42LDE4NS4yIDEzMC41LDE3Ni4xICIvPgo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjE3OS43LDE5My41IDE4OCwxNzYuMSAyMDgsMTg1LjIgIi8+CjxnPgoJPHBvbHlnb24gY2xhc3M9InN0NCIgcG9pbnRzPSIxMDYuOCwyNDcuNCAxMTEuNiwyMDYuOCA4MC4zLDIwNy43IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDQiIHBvaW50cz0iMjA3LDIwNi44IDIxMS44LDI0Ny40IDIzOC4zLDIwNy43IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDQiIHBvaW50cz0iMjMwLjgsMTYyLjEgMTc0LjYsMTY0LjYgMTc5LjgsMTkzLjUgMTg4LjEsMTc2LjEgMjA4LjEsMTg1LjIgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0NCIgcG9pbnRzPSIxMTAuNiwxODUuMiAxMzAuNiwxNzYuMSAxMzguOCwxOTMuNSAxNDQuMSwxNjQuNiA4Ny44LDE2Mi4xIAkiLz4KPC9nPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDUiIHBvaW50cz0iODcuOCwxNjIuMSAxMTEuNCwyMDguMSAxMTAuNiwxODUuMiAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3Q1IiBwb2ludHM9IjIwOC4xLDE4NS4yIDIwNy4xLDIwOC4xIDIzMC44LDE2Mi4xIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDUiIHBvaW50cz0iMTQ0LjEsMTY0LjYgMTM4LjgsMTkzLjUgMTQ1LjQsMjI3LjYgMTQ2LjksMTgyLjcgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0NSIgcG9pbnRzPSIxNzQuNiwxNjQuNiAxNzEuOSwxODIuNiAxNzMuMSwyMjcuNiAxNzkuOCwxOTMuNSAJIi8+CjwvZz4KPHBvbHlnb24gY2xhc3M9InN0NiIgcG9pbnRzPSIxNzkuOCwxOTMuNSAxNzMuMSwyMjcuNiAxNzcuOSwyMzAuOSAyMDcuMSwyMDguMSAyMDguMSwxODUuMiAiLz4KPHBvbHlnb24gY2xhc3M9InN0NiIgcG9pbnRzPSIxMTAuNiwxODUuMiAxMTEuNCwyMDguMSAxNDAuNiwyMzAuOSAxNDUuNCwyMjcuNiAxMzguOCwxOTMuNSAiLz4KPHBvbHlnb24gY2xhc3M9InN0NyIgcG9pbnRzPSIxODAuMywyNjIuMyAxODAuNiwyNTMgMTc4LjEsMjUwLjggMTQwLjQsMjUwLjggMTM4LjEsMjUzIDEzOC4zLDI2Mi4zIDEwNi44LDI0Ny40IDExNy44LDI1Ni40IAoJMTQwLjEsMjcxLjkgMTc4LjQsMjcxLjkgMjAwLjgsMjU2LjQgMjExLjgsMjQ3LjQgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDgiIHBvaW50cz0iMTc3LjksMjMwLjkgMTczLjEsMjI3LjYgMTQ1LjQsMjI3LjYgMTQwLjYsMjMwLjkgMTM4LjEsMjUzIDE0MC40LDI1MC44IDE3OC4xLDI1MC44IDE4MC42LDI1MyAiLz4KPGc+Cgk8cG9seWdvbiBjbGFzcz0ic3Q5IiBwb2ludHM9IjI3OC4zLDExNC4yIDI4Ni44LDczLjQgMjc0LjEsMzUuNSAxNzcuOSwxMDYuOSAyMTQuOSwxMzguMiAyNjcuMiwxNTMuNSAyNzguOCwxNDAgMjczLjgsMTM2LjQgCgkJMjgxLjgsMTI5LjEgMjc1LjYsMTI0LjMgMjgzLjYsMTE4LjIgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0OSIgcG9pbnRzPSIzMS44LDczLjQgNDAuMywxMTQuMiAzNC45LDExOC4yIDQyLjksMTI0LjMgMzYuOCwxMjkuMSA0NC44LDEzNi40IDM5LjgsMTQwIDUxLjMsMTUzLjUgMTAzLjYsMTM4LjIgCgkJMTQwLjYsMTA2LjkgNDQuNCwzNS41IAkiLz4KPC9nPgo8cG9seWdvbiBjbGFzcz0ic3Q2IiBwb2ludHM9IjI2Ny4yLDE1My41IDIxNC45LDEzOC4yIDIzMC44LDE2Mi4xIDIwNy4xLDIwOC4xIDIzOC4zLDIwNy43IDI4NC44LDIwNy43ICIvPgo8cG9seWdvbiBjbGFzcz0ic3Q2IiBwb2ludHM9IjEwMy42LDEzOC4yIDUxLjMsMTUzLjUgMzMuOSwyMDcuNyA4MC4zLDIwNy43IDExMS40LDIwOC4xIDg3LjgsMTYyLjEgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDYiIHBvaW50cz0iMTc0LjYsMTY0LjYgMTc3LjksMTA2LjkgMTkzLjEsNjUuOCAxMjUuNiw2NS44IDE0MC42LDEwNi45IDE0NC4xLDE2NC42IDE0NS4zLDE4Mi44IDE0NS40LDIyNy42IAoJMTczLjEsMjI3LjYgMTczLjMsMTgyLjggIi8+Cjwvc3ZnPgo="
                                    alt="MetaMask"
                                    width={32}
                                    height={32}
                                />}
                            >
                                Connect Wallet
                            </Button>
                        </>)}
                </>)
            }
        </>
    )
}