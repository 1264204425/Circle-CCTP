export default async function getCoinPrice(coinUSDCPair: any) {
    console.info(`Fetching price for ${coinUSDCPair}`)
    try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coinUSDCPair}`);
        if (!response.ok) {
            throw new Error(`Binance API responded with ${response.statusText}`);
        }
        const data = await response.json();
        const coinPrice = "$" + data.price.toString();
        return coinPrice;

    } catch (e) {
        console.error(e)
        return "Reacquire..."
    }

}