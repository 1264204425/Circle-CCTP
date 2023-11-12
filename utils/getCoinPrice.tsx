export default async function getCoinPrice(coinUSDCPair: any) {
    console.info(`Fetching price for ${coinUSDCPair}`)
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coinUSDCPair}`);
    if (!response.ok) {
        throw new Error(`Binance API responded with ${response.statusText}`);
    }
    const data = await response.json();
    const coinPrice = "$" + data.price.toString();
    console.info(`Price for ${coinUSDCPair} is ${coinPrice}`)
    
    return coinPrice;
}