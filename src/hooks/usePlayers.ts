import { useLocalStorage } from "@mantine/hooks"

export const usePlayers = () =>
  useLocalStorage<Array<{
    pos?: any
    name: string
    teamKey?: string
  }> | null>({
    key: "players",
    defaultValue: null,
  })
