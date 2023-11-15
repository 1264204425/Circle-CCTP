import { configureStore, createSlice } from '@reduxjs/toolkit';

const networkSlice = createSlice({
    name: 'networkInfo',
    initialState: {
        chainName: null,
        chainID: null,
        address: null,
        balance: null,
        coinSymbol: null,
        coinPrice: null,
        coinUSDCPair: null,
        USDCProxyAddress: null,
        USDCAddress: null,
        RouterAddress: null,
        WrappedCoinAddress: null,
        TokenMessengerAddr: null,
        MessageTransmitterAddr: null,
        scanApiURL: null,
        scanURLL: null,
        scanApiKey: null,
        isFinished: false,
        erc20Token: null,
        routerContract: null,
        TokenMessagerContract: null,
        USDCTokenInfo: null
    },
    reducers: {
        setChainName: (state, action) => {
            state.chainName = action.payload
        },
        setChainID: (state, action) => {
            state.chainID = action.payload
        },
        setAddress: (state, action) => {
            state.address = action.payload
        },
        setBalance: (state, action) => {
            state.balance = action.payload
        },
        setCoinSymbol: (state, action) => {
            state.coinSymbol = action.payload
        },
        setCoinPrice: (state, action) => {
            state.coinPrice = action.payload
        },
        setCoinUSDCPair: (state, action) => {
            state.coinUSDCPair = action.payload
        },
        setUSDCProxyAddress: (state, action) => {
            state.USDCProxyAddress = action.payload
        },
        setUSDCAddress: (state, action) => {
            state.USDCAddress = action.payload
        },
        setRouterAddress: (state, action) => {
            state.RouterAddress = action.payload
        },
        setWrappedCoinAddress: (state, action) => {
            state.WrappedCoinAddress = action.payload
        },
        setTokenMessengerAddr: (state, action) => {
            state.TokenMessengerAddr = action.payload
        },
        setMessageTransmitterAddr: (state, action) => {
            state.MessageTransmitterAddr = action.payload
        },
        setScanApiURL: (state, action) => {
            state.scanApiURL = action.payload
        },
        setScanURLL: (state, action) => {
            state.scanURLL = action.payload
        },
        setScanApiKey: (state, action) => {
            state.scanApiKey = action.payload
        },
        setIsFinished: (state, action) => {
            state.isFinished = action.payload
        },
        setErc20Token: (state, action) => {
            state.erc20Token = action.payload
        },
        setRouterContract: (state, action) => {
            state.routerContract = action.payload
        },
        setTokenMessagerContract: (state, action) => {
            state.TokenMessagerContract = action.payload
        },
        setUSDCTokenInfo: (state, action) => {
            state.USDCTokenInfo = action.payload
        }
    }
})

export const {
    setChainName,
    setChainID,
    setAddress,
    setBalance,
    setCoinSymbol,
    setCoinPrice,
    setCoinUSDCPair,
    setUSDCProxyAddress,
    setUSDCAddress,
    setRouterAddress,
    setWrappedCoinAddress,
    setTokenMessengerAddr,
    setMessageTransmitterAddr,
    setScanApiURL,
    setScanURLL,
    setScanApiKey,
    setIsFinished,
    setErc20Token,
    setTokenMessagerContract,
    setRouterContract,
    setUSDCTokenInfo,
} = networkSlice.actions;

export const selectChainName = (state: {
    networkInfo: {
        chainName: any;
    }
}) => state.networkInfo.chainName;

export const selectChainID = (state: {
    networkInfo: {
        chainID: any
    }
}) => state.networkInfo.chainID;

export const selectAddress = (state: {
    networkInfo: {
        address: any;
    }
}) => state.networkInfo.address

export const selectBalance = (state: {
    networkInfo: {
        balance: any;
    }
}) => state.networkInfo.balance

export const selectCoinSymbol = (state: {
    networkInfo: {
        coinSymbol: any;
    }
}) => state.networkInfo.coinSymbol

export const selectCoinPrice = (state: {
    networkInfo: {
        coinPrice: any;
    }
}) => state.networkInfo.coinPrice

export const selectCoinUSDCPair = (state: {
    networkInfo: {
        coinUSDCPair: any;
    }
}) => state.networkInfo.coinUSDCPair

export const selectUSDCProxyAddress = (state: {
    networkInfo: {
        USDCProxyAddress: any;
    }
}) => state.networkInfo.USDCProxyAddress

export const selectUSDCAddress = (state: {
    networkInfo: {
        USDCAddress: any;
    }
}) => state.networkInfo.USDCAddress

export const selectRouterAddress = (state: {
    networkInfo: {
        RouterAddress: any;
    }
}) => state.networkInfo.RouterAddress

export const selectWrappedCoinAddress = (state: {
    networkInfo: {
        WrappedCoinAddress: any;
    }
}) => state.networkInfo.WrappedCoinAddress

export const selectTokenMessengerAddr = (state: {
    networkInfo: {
        TokenMessengerAddr: any;
    }
}) => state.networkInfo.TokenMessengerAddr

export const selectMessageTransmitterAddr = (state: {
    networkInfo: {
        MessageTransmitterAddr: any;
    }
}) => state.networkInfo.MessageTransmitterAddr

export const selectScanApiURL = (state: {
    networkInfo: {
        scanApiURL: any;
    }
}) => state.networkInfo.scanApiURL

export const selectScanURLL = (state: {
    networkInfo: {
        scanURLL: any;
    }
}) => state.networkInfo.scanURLL

export const selectScanApiKey = (state: {
    networkInfo: {
        scanApiKey: any;
    }
}) => state.networkInfo.scanApiKey

export const selectIsFinished = (state: {
    networkInfo: {
        isFinished: any;
    }
}) => state.networkInfo.isFinished

export const selectErc20Token = (state: {
    networkInfo: {
        erc20Token: any;
    }
}) => state.networkInfo.erc20Token;

export const selectTokenMessagerContract = (state: {
    networkInfo: {
        TokenMessagerContract: any;
    }
}) => state.networkInfo.TokenMessagerContract;

export const selectRouterContract = (state: {
    networkInfo: {
        routerContract: any;
    }
}) => state.networkInfo.routerContract;

export const selectUSDCTokenInfo = (state: {
    networkInfo: {
        USDCTokenInfo: any;
    }
}) => state.networkInfo.USDCTokenInfo

export default configureStore({
    reducer: {
        networkInfo: networkSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 禁用序列化检查
        }),
})

