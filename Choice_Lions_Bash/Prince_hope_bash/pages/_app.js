import "../styles/globals.css";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

const supportedChainIds = [4];

const connectors = {
  injected: {},
};
import { AppProvider } from "../components/context";
function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      {" "}
      <ThirdwebWeb3Provider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <Component {...pageProps} />
      </ThirdwebWeb3Provider>
    </AppProvider>
  );
}

export default MyApp;
