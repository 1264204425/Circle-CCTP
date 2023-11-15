export default async function getContractABI(scanApiURL: any, contractAddress: any, scanApiKey: any) {
    console.info("getContractABI")
    console.info(scanApiURL, contractAddress, scanApiKey)
    try {
        const url = `${scanApiURL}?module=contract&action=getabi&address=${contractAddress}&apikey=${scanApiKey}`
        console.info(url)
        const fetchedABI = await fetch(url);
        const contractABI = await fetchedABI.json();
        if (contractABI.status === '1') {
            console.info("========================")
            console.info(JSON.parse(contractABI.result))
            console.info("========================")
            return JSON.parse(contractABI.result);
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        console.info("========================")
        return null;
    }
}