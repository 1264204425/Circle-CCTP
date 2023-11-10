import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { DownSmall, DropDownList, Unlink, WalletThree } from "@icon-park/react";
import { disconnectWallet, getCoinSymbol, getNetworkInfo } from "@/components/connectWallet";
import { useSDK } from "@metamask/sdk-react";
import { useMetaMask } from "@/hooks/useMetaMask";
import { formatAddress, formatBalance, formatChainAsNum } from "@/utils/formot";
import globalData from "@/models/globalData";

// 检测用户是否使用手机
function isMobileDevice() {
    console.info("检测设备")
    console.info(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function ConnectButton() {

    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState<any>()
    const [networkInfo, setNetworkInfo] = useState(null)
    const [balance, setBalance] = useState<string>()

    // metamask
    const { sdk, connected, connecting, provider } = useSDK();

    // const { balance, hexChainId, numericChainId } = useBalances()
    const { wallet } = useMetaMask()

    const onConnectMetaMask = async () => {
        try {
            const accounts = await sdk?.connect();
            setLoading(true)
            console.info(accounts);

            setAccount(accounts?.[0]);

            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [accounts[0], 'latest']
            });
            setBalance(formatBalance(typeof balance === "string" ? balance : balance.toString()));
            setNetworkInfo(await getNetworkInfo(formatChainAsNum(wallet.chainId)));
        } catch (error) {
            sdk?.terminate()
            console.error(error);
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLoading(false)
        }
    }

    const onDisconnectMetaMask = () => {
        // 断开连接
        sdk?.terminate()
        disconnectWallet().then(() =>
            setAccount("")
        )
    };

    useEffect(() => {
        async function getLoader() {
            const { trio } = await import('ldrs')
            trio.register()
        }

        getLoader()
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
                        startContent={
                            <>
                                <l-trio
                                    size="20"
                                    speed="1.3"
                                    color="#2F88FF"
                                ></l-trio>
                            </>
                        }
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
                                            endContent={<DownSmall theme="multi-color" size="25"
                                                                   fill={['#ffffff', '#2F88FF', '#FFF', '#43CCF8']}
                                                                   strokeWidth={2}
                                                                   strokeLinecap="square"/>}
                                        >
                                            {/*{account.substring(0, 10)}...*/}
                                            Wallet
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem
                                            key="address"
                                            isDisabled={true}
                                            textValue={account && `${account.substring(0, 5)}...${account.substring(account.length - 5)}`}
                                        >
                                            <div className="flex flex-row">
                                                <span>Address:</span>
                                                <span>{account && `${account.substring(0, 5)}...${account.substring(account.length - 5)}`}</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="balance"
                                            isDisabled={true}
                                            textValue={balance}
                                        >
                                            <div className="flex flex-row">
                                                <span>Balance:</span>
                                                <span>{balance}{networkInfo.coinSymbol}</span>
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
                </>)}

        </>
    )
}