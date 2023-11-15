import { ethers } from "ethers";

export default async function swapExactCoinForToken(
    isIntraSwap: boolean,
    AmountInForSwap: any,
    toAddress: any,
    account: any,
    wrappedCoinAddress: any,
    USDCProxyAddress: any,
    receive: any,
    routerContract: any,
    scanURLL: any,
    decimal: any,
    chainID: any,
    contractInfo: any
) {
    let USDCTransferred: any
    let to: any
    const amountIn = ethers.utils.parseEther(AmountInForSwap).toString();
    if (isIntraSwap == true) {
        to = toAddress;
    } else {
        to = account;                // In the case of crosschain swap: Swapped USDC will be transferred to the same account as the one who inputs coin.
    }
    const path = [wrappedCoinAddress, USDCProxyAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;           // deadline = current time + 10 minutes
    const amountOutMinInWei = (ethers.utils.parseUnits(receive, Number(decimal))).toString();
    // Then, get the transaction hash.
    let tx;
    // Notice: The function name of the router contract deployed on Avalanche or Avalanche-Fuji Testnet, differs from those on the other chain.
    if (chainID == 43114 || chainID == 43113) {
        tx = await routerContract.swapExactAVAXForTokens(amountOutMinInWei, path, to, deadline, { value: amountIn });
    } else {
        tx = await routerContract.swapExactETHForTokens(amountOutMinInWei, path, to, deadline, { value: amountIn });
    }
    const txHash = tx.hash;
    console.log('Transaction Hash:', txHash);
    // if conduct an intra-chain swap, output the Txhash to the front end.
    if (isIntraSwap == true) {
        console.info("Please check the transaction status on the block explorer.", scanURLL + 'tx/' + txHash)
        return scanURLL + 'tx/' + txHash
    }
    try {
        const txReceipt = await tx.wait();
        const transferEvents = txReceipt.logs.filter((log) => {
            return log.address.toLowerCase() === USDCProxyAddress.toLowerCase() && log.topics[0] == ethers.utils.id("Transfer(address,address,uint256)");
        });
        transferEvents.forEach((event) => {
            const parsedEvent = contractInfo.erc20Token.interface.parseLog(event);
            // USDCTransferred is in basic unit
            USDCTransferred = ethers.BigNumber.from(parsedEvent.args.value);
            console.log(`Transferred amount of USDC in basic unit: ${USDCTransferred}`);
        });
        return USDCTransferred;
    } catch (error) {
        console.error(`Error happened when execute swapExactCoinForToken: ${error}`);
    }
}
