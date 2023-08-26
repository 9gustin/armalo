import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Button } from "@mantine/core"
import { DndList } from "./DD"

export const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (!currentUser) {
    return null
  }

  return <DndList />
}
