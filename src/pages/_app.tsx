import "../styles/globals.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api, setToken } from "../utils/api";

import { useAtom } from "jotai";
import Script from "next/script";
import { ReactElement, ReactNode, useEffect } from "react";
import ErrorBoundary from "../components/error-boundary";
import * as twitch from '../utils/twitch';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" strategy="beforeInteractive" />
      <ErrorBoundary>
        <ExtensionListeners>
          <Component {...pageProps} />
        </ExtensionListeners>
      </ErrorBoundary>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

const ExtensionListeners = (props: { children: ReactNode }) => {
  const [_, setIdentified] = useAtom(twitch.viewerIdentified);
  useEffect(() => {
    window.Twitch.ext.onAuthorized(async (auth) => {
      setIdentified(true);
      setToken(auth.token);
    });
    window.Twitch.ext.onError((err) => { throw err });
  }, []);
  return (
    <>
      {props.children}
    </>
  )
}