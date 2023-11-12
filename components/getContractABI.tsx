export default async function getContractABI(scanApiUrl: any, contractAddress: string, scanApiKey: any) {
    try {
        const fetchedABI = await fetch(`${scanApiUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${scanApiKey}`);
        const contractABI = await fetchedABI.json();
        if (contractABI.status === '1') {
            return JSON.parse(contractABI.result);
        } else {
            this.errorMessage = `Failed to get contract ABI for address: ${contractAddress}, status: ${contractABI.status}`;
            console.error(this.errorMessage);
            return null;
        }
    } catch (error) {
        this.errorMessage = error.toString();
        console.error(this.errorMessage);
        return null;
    }
}