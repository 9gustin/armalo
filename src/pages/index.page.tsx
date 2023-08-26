import { Suspense, useLayoutEffect } from "react"
import Layout from "src/core/layouts/Layout"
import { BlitzPage, Routes } from "@blitzjs/next"
import { Button, Checkbox, Group, Textarea, Title, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import Link from "next/link"
import { useRouter } from "next/router"
import { useToggle } from "@mantine/hooks"
import { buildListFromStr } from "@/utils/buildListFromStr"
import { usePlayers } from "@/hooks/usePlayers"

export const PLACEHOLDER_DEFAULT = `
1. Agus
2. Juan
3. Pedro
4. Carlos
5. Luis
6. Jose
7. Martin
8. Pablo
9. Lucas
10. Matias
`.trim()

const Home: BlitzPage = () => {
  const router = useRouter()
  const theme = useMantineTheme()
  const [hasPlayers, setPlayers] = usePlayers()
  const [loading, setLoading] = useToggle()
  const form = useForm({
    initialValues: {
      players: "",
      rmFirstLine: true,
    },
  })

  const handleSubmit = (values) => {
    setLoading()
    setPlayers(buildListFromStr(values.players, values.rmFirstLine))
    router.push(Routes.Builder())
  }

  useLayoutEffect(() => {
    if (hasPlayers) {
      router.push(Routes.Builder())
    }
  }, [hasPlayers])

  return (
    <Layout title="Arma tu fulbito">
      <Suspense fallback="Loading...">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group
            dir="column"
            p={16}
            sx={{
              gap: 16,
            }}
          >
            <Title
              p={24}
              pl={2}
              sx={{
                border: `2px solid ${theme.colors.green[0]}`,
              }}
            >
              Arma tu fulbito
            </Title>

            <Textarea
              sx={{
                width: "100%",
              }}
              placeholder={
                form.values.rmFirstLine
                  ? `Lista de jugadores: \n${PLACEHOLDER_DEFAULT}`
                  : PLACEHOLDER_DEFAULT
              }
              label="Pegá tu lista de jugadores"
              autosize
              minRows={2}
              {...form.getInputProps("players")}
            />
            <Checkbox
              label="Ignorar primer linea"
              checked={form.values.rmFirstLine}
              {...form.getInputProps("rmFirstLine")}
            />
            <Button loading={loading} type="submit">
              Armalo
            </Button>
            <Button component={Link} href={Routes.Builder()} variant="outline">
              Armalo desde cero
            </Button>
          </Group>
        </form>
      </Suspense>
    </Layout>
  )
}

export default Home
