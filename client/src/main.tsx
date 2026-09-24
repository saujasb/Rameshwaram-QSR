import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AuthProvider } from "./lib/auth/AuthContext";
import { ApiError } from "./lib/api/client";
import "./modules/auth/auth.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      // Don't retry "not signed in" / "not allowed" -- retrying can't fix those.
      retry: (failureCount, error) => !(error instanceof ApiError && (error.status === 401 || error.status === 403)) && failureCount < 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
