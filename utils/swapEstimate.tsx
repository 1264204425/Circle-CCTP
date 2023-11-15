import { ethers } from 'ethers';

// AmountInForSwap输入
// slippage 滑点
// USDCProxyAddress
// routerContract
// decimal
export default async function swapEstimate(
    AmountInForSwap: any,
    slippage: any,
    WrappedCoinAddress: any,
    USDCProxyAddress: any,
    routerContract: any,
    decimal: any
) {
    let swapEstimateOut = null;

    // Check amountIn:
    if (isNaN(parseFloat(AmountInForSwap)) || isNaN(parseInt(AmountInForSwap)) || parseFloat(AmountInForSwap) < 0) {
        AmountInForSwap = null;
    }

    // Check slippage:
    if (isNaN(parseFloat(slippage)) || isNaN(parseInt(slippage)) || parseFloat(slippage) < 0 || parseFloat(slippage) >= 100) {
        slippage = null;
    }

    if (parseFloat(AmountInForSwap) > 0 && slippage !== null) {
        const amountIn = ethers.utils.parseEther(AmountInForSwap);
        const path = [WrappedCoinAddress, USDCProxyAddress];

        // Get the decimal length after decimal point. And plus the percent-decimal length (2).
        const slippageDecimalLength = countDecimalsForFloat(parseFloat(slippage)) + 2;
        const multiplyFactor = ethers.BigNumber.from(10 ** slippageDecimalLength);
        // @ts-ignore
        const slippageConverted = ethers.BigNumber.from(parseFloat(slippage) * (multiplyFactor / 100));
        const USDCdecimal = 1 * 10 ** decimal;
        const amountsOutResponse = await routerContract.getAmountsOut(amountIn, path);
        const estimatedAmountOut = amountsOutResponse[1];
        const factorMinusSlippage = multiplyFactor.sub(slippageConverted);
        // @ts-ignore
        const amountOutMinRes = estimatedAmountOut.mul(factorMinusSlippage).div(1 * multiplyFactor);
        const amountOutMinDivided = parseFloat(amountOutMinRes.toString()) / USDCdecimal;
        swapEstimateOut = amountOutMinDivided.toString();
    } else {
        swapEstimateOut = 0;
    }

    return swapEstimateOut;
};

const countDecimalsForFloat = (value) => {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
};

