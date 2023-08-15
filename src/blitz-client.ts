import { AuthClientPlugin } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"
import { BlitzRpcPlugin, getQueryClient } from "@blitzjs/rpc"

export const authConfig = {
  cookiePrefix: "armalo",
}

export const { withBlitz } = setupBlitzClient({
  plugins: [
    AuthClientPlugin(authConfig),
    BlitzRpcPlugin({
      reactQueryOptions: {
        queries: {
          retry: 2,
        },
        mutations: {
          onSuccess: async () => {
            const queryClient = getQueryClient()
            await queryClient.invalidateQueries()
          },
        },
      },
    }),
  ],
})
