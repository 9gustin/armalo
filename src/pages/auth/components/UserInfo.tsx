import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Button } from "@mantine/core"

export const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (!currentUser) {
    return null
  }

  return (
    <>
      <Button
        onClick={async () => {
          await logoutMutation()
        }}
      >
        Logout
      </Button>
      <div>
        User id: <code>{currentUser.id}</code>
        <br />
        User role: <code>{currentUser.role}</code>
      </div>
    </>
  )
}
