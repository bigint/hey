import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, type ReactNode, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/Common/ErrorBoundary";
import FullPageLoader from "@/components/Shared/FullPageLoader";
import authLink from "@/helpers/authLink";
import { ThemeProvider } from "@/hooks/useTheme";
import { createApolloClient } from "@/indexer/apollo/client";

const Web3Provider = lazy(() => import("./Web3Provider"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const lensApolloClient = createApolloClient(authLink);

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullPageLoader />}>
          <Web3Provider>
            <ApolloProvider client={lensApolloClient}>
              <HelmetProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </HelmetProvider>
            </ApolloProvider>
          </Web3Provider>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Providers;
