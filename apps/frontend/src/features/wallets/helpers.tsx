import React from "react"
import BigNumber from "bignumber.js"
import { getOfflineSigner as cosmostationSigner } from "@cosmostation/cosmos-client"
import {
    Coin,
    OfflineSigner,
    SigningStargateClient,
    StargateClient,
    StdSignature,
    SUPPORTED_WALLET
} from "cudosjs"

import { userState } from "../../core/store/user"
import { CHAIN_DETAILS } from "../../core/utilities/Constants"
import { connectCosmostationLedger } from "./Cosmostation"
import { connectKeplrLedger } from "./Keplr"
import { LAYOUT_CONTENT_TEXT, SvgComponent } from "../../core/presentation/components/Layout/helpers"
import { LOG_IN_USER } from "../../core/api/calls"
import { connectSocket, disconnectSocket, socketConnection } from "../../App"

import { styles } from "./styles"

export const connectWalletByType = async (walletType: SUPPORTED_WALLET) => {

    if (walletType === SUPPORTED_WALLET.Keplr) {
        return connectKeplrLedger()
    }

    if (walletType === SUPPORTED_WALLET.Cosmostation) {
        return connectCosmostationLedger()
    }

    return { address: '', accountName: '' }
}

export const getOfflineSignerByType = async (walletType: SUPPORTED_WALLET): Promise<OfflineSigner | undefined> => {

    const chainId = CHAIN_DETAILS.CHAIN_ID[CHAIN_DETAILS.DEFAULT_NETWORK]

    if (walletType === SUPPORTED_WALLET.Keplr) {
        return window.keplr?.getOfflineSigner(chainId)
    }

    if (walletType === SUPPORTED_WALLET.Cosmostation) {
        return cosmostationSigner(chainId)
    }

    return undefined
}

export const getSigningClient = async (walletType: SUPPORTED_WALLET): Promise<SigningStargateClient> => {

    const offlineSigner = await getOfflineSignerByType(walletType)

    if (window.keplr) {
        window.keplr.defaultOptions = {
            sign: {
                preferNoSetFee: true,
            },
        }
    }

    if (!offlineSigner) {
        throw new Error("Invalid signing client");
    }

    const rpcAddress = CHAIN_DETAILS.RPC_ADDRESS[CHAIN_DETAILS.DEFAULT_NETWORK]

    return SigningStargateClient.connectWithSigner(rpcAddress, offlineSigner)
}

export const getQueryClient = async (rpcAddress: string): Promise<StargateClient> => {
    const client = await StargateClient.connect(rpcAddress)
    return client
}

export const getAccountBalances = async (accountAddress: string): Promise<readonly Coin[]> => {
    const rpcAddress = CHAIN_DETAILS.RPC_ADDRESS[CHAIN_DETAILS.DEFAULT_NETWORK]
    const queryClient = await getQueryClient(rpcAddress)
    return queryClient.getAllBalances(accountAddress)
}

export const getNativeBalance = (balances: readonly Coin[]): string => {
    let nativeBalance = '0'
    balances.forEach((balance) => {
        if (balance.denom === CHAIN_DETAILS.NATIVE_TOKEN_DENOM && new BigNumber(balance.amount).gt(0)) {
            nativeBalance = balance.amount
        }
    })
    return nativeBalance
}

export const connectUser = async (walletType: SUPPORTED_WALLET, setMedia: () => Promise<void>): Promise<userState> => {

    const { address: connectedAddress, accountName } = await connectWalletByType(walletType)
    const currentBalances = await getAccountBalances(connectedAddress)
    const userNativeBalance = getNativeBalance(currentBalances)

    const message = 'Allowlist tool login';
    const { signature } = await signArbitrary(walletType, connectedAddress, message)

    const reqData = {
        signature,
        connectedAddress,
        message,
    };

    const res = await LOG_IN_USER(reqData)

    const connectedUser: userState = {
        userId: res.data.userId,
        accountName: accountName,
        connectedAddress: connectedAddress,
        balances: currentBalances,
        nativeBalance: userNativeBalance,
        connectedWallet: walletType,
    }

    await connectSocket(connectedAddress, setMedia)

    return connectedUser
}

export const disconnectWalletByType = async (walletType: SUPPORTED_WALLET) => {

    disconnectSocket()

    if (walletType === SUPPORTED_WALLET.Keplr) {
        // Keplr seems to not offer a particular disconnect method
        return
    }

    if (walletType === SUPPORTED_WALLET.Cosmostation) {
        await window.cosmostation.cosmos.request({
            method: "cos_disconnect",
        });
        return
    }
}

export const signArbitrary = async (
    walletType: SUPPORTED_WALLET,
    signingAddress: string,
    message: string
): Promise<{ signature: StdSignature }> => {
    const chainId = CHAIN_DETAILS.CHAIN_ID[CHAIN_DETAILS.DEFAULT_NETWORK]
    let signature: StdSignature = {
        pub_key: undefined,
        signature: ""
    }
    if (walletType === SUPPORTED_WALLET.Keplr) {
        signature = await window.keplr!.signArbitrary(chainId, signingAddress, message)
    }

    if (walletType === SUPPORTED_WALLET.Cosmostation) {
        signature = await window.cosmostation.providers.keplr.signArbitrary(chainId, signingAddress, message)
    }
    return { signature }
}

export const SUPPORTED_WALLET_LOGOS = {
    [SUPPORTED_WALLET.Keplr]: <SvgComponent type={LAYOUT_CONTENT_TEXT.KeplrLogo} style={styles.keplrLogo} />,
    [SUPPORTED_WALLET.Cosmostation]: <SvgComponent type={LAYOUT_CONTENT_TEXT.CosmostationLogo} style={styles.cosmostationLogo} />
}
