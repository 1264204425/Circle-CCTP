import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import type { AppProps } from "next/app";
import { MetaMaskProvider } from '@metamask/sdk-react';
import { MetaMaskContextProvider } from "@/hooks/useMetaMask";


export default function App({ Component, pageProps }: AppProps) {
    return (
        <MetaMaskContextProvider>
            <MetaMaskProvider debug={false} sdkOptions={{
                checkInstallationImmediately: false,
                dappMetadata: {
                    name: "Demo React App",
                    url: typeof window !== 'undefined' ? window.location.host : ''
                }
            }}>
                <NextUIProvider>
                    <NextThemesProvider>
                        <Component {...pageProps} />
                    </NextThemesProvider>
                </NextUIProvider>
            </MetaMaskProvider>
        </MetaMaskContextProvider>
    );
}

export const fonts = {
    sans: fontSans.style.fontFamily,
    mono: fontMono.style.fontFamily,
};
