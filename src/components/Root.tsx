import { queryClient } from "@/api/queryClient";
import { App } from "@/components/App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
import { publicUrl } from "@/lib/publicUrl";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { BrowserRouter } from "react-router";

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center">
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TonConnectUIProvider
            manifestUrl={
              "https://rnsjx-34-118-112-64.a.free.pinggy.link/tonconnect-manifest.json"
            }
          >
            <App />
            {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
          </TonConnectUIProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
