import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { MantineProvider } from "@mantine/core"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import { withBlitz } from "src/blitz-client"
import "../styles/globals.css"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          primaryColor: "green",
          colors: {
            green: [
              "#A5CC6B",
              "#679436",
              "#679436",
              "#679436",
              "#679436",
              "#679436",
              "#679436",
              "#679436",
              "#679436",
              "#679436",
            ],
          },
          components: {
            TextInput: {
              defaultProps: {
                size: "lg",
              },
            },
            Text: {
              defaultProps: {
                size: "lg",
              },
            },
            Textarea: {
              defaultProps: {
                size: "lg",
              },
            },
            Button: {
              defaultProps: {
                size: "lg",
                radius: 10,
                fullWidth: true,
              },
            },
          },
        }}
      >
        <Suspense fallback="Loading...">
          <Component {...pageProps} />
        </Suspense>
      </MantineProvider>
    </ErrorBoundary>
  )
}

export default withBlitz(MyApp)
