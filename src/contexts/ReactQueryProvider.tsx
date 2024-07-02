import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
const queryClient = new QueryClient()

const ReactQueryProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

export default ReactQueryProvider
