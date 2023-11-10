import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { Down } from "@icon-park/react";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useEffect, useState } from "react";

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
        { chainID: 1, chainName: "Ethereum Mainnet", img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880" },
        { chainID: 43114, chainName: "Avalanche C-Chain", img: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818" },
        { chainID: 10, chainName: "Optimism Mainnet", img: "" },
        { chainID: 42161, chainName: "Arbitrum One", img: "" },
        { chainID: 8453, chainName: "Base", img: "https://chainid.network/static/8bf043c4eab7887a7504aa3cea79e55d/e73fe/base.webp" },
        { chainID: 5, chainName: "Ethereum Goerli Testnet", img: "" },
        { chainID: 43113, chainName: "Avalanche Fuji Testnet", img: "" },
        { chainID: 420, chainName: "Optimism Goerli Testnet", img: "" },
        { chainID: 421613, chainName: "Arbitrum Goerli Testnet", img: "" },
        { chainID: 84531, chainName: "Base Goerli Testnet", img: "" },
    ];
    const { wallet } = useMetaMask()
    const address = false
    // const [address, setAddress] = useState<string | undefined>("")
    // useEffect(() => {
    //     if (wallet) {
    //         const address = wallet.accounts[0]
    //         setAddress(address)
    //     }
    // }, [wallet]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

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
                            <div className="mt-10 content-center items-center justify-center">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2">
                                        <Input
                                            size="lg"
                                            label="You Pay"
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
                                    {address && typeof address === 'string' ? (
                                        <div className="flex flex-row gap-1 mt-0.5">
                                            <span className="text-sm text-gray-500">
                                                Current Address : {address}
                                            </span>
                                        </div>
                                    ) : <></>}

                                </div>
                                <div className="flex w-full flex-col items-center mt-3 mb-3">
                                    <Down theme="multi-color" size="30" fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                                          strokeWidth={2} strokeLinecap="square"/>
                                </div>
                                <Input size="lg" label="You Receive"/>
                            </div>
                        </>}
                    </div>
                </CardBody>
                <div className="flex flex-col mx-5 mb-5 mt-5">
                    <Button color="primary" size="lg">
                        Primary
                    </Button>
                </div>
            </Card>
        </div>
    )
}