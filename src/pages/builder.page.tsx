import { usePlayers } from "@/hooks/usePlayers"
import { BlitzPage, Routes } from "@blitzjs/next"
import {
  Button,
  Container,
  Drawer,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import {
  IconArrowLeft,
  IconBrandWhatsapp,
  IconCheck,
  IconDownload,
  IconShirt,
  IconTrash,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react"
import Draggable from "react-draggable"
import { useClickOutside, useDisclosure } from "@mantine/hooks"
import { useRouter } from "next/router"
import { useMemo, useRef } from "react"
import { toPng } from "html-to-image"

export const TEAMS = {
  A: {
    key: "A",
    name: "Equipo Rojo",
    color: "red",
  },
  B: {
    key: "B",
    name: "Equipo Azul",
    color: "blue",
  },
}

const Builder: BlitzPage = () => {
  const form = useForm({
    initialValues: {
      name: "",
    },
  })
  const router = useRouter()
  const [names, setPlayers] = usePlayers()
  const { wTeam, withoutTeam } = useMemo(() => {
    if (!names) {
      return {}
    }

    return {
      wTeam: names.filter(({ teamKey }) => teamKey),
      withoutTeam: names.filter(({ teamKey }) => !teamKey),
    }
  }, [names])

  const [opened, { close, open }] = useDisclosure(false)
  const [modalRestart, { close: closeRestart, open: openRestart }] = useDisclosure(false)
  const [isDeleteMode, { toggle: toggleDeleteMode }] = useDisclosure(false)
  const hasPlayers = wTeam && wTeam.length > 0

  const [playersDrawer, { toggle: togglePlayersDrawer, close: closePlayersDrawer }] =
    useDisclosure(false)
  const [isCreateMode, { toggle: toggleCreateMode }] = useDisclosure(false)
  const drawerRef = useClickOutside(closePlayersDrawer)

  const dropZone = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mid = useRef<HTMLHRElement>(null)
  const { primaryColor, colors, black, white } = useMantineTheme()

  const handleCreate = ({ name }) => {
    if (!name.trim()) {
      toggleCreateMode()
      return
    }
    const newPlayer = { name }

    setPlayers((prev) => (prev ? [...prev, newPlayer] : [newPlayer]))
    form.reset()
  }

  const handleUpdate = (name, data) => {
    if (data && name) {
      const { x, y } = data
      const { bottom, height } = data.node ? data.node.getBoundingClientRect() : data
      const positionCenter = bottom - height / 2
      const team = resolveTeam(positionCenter)

      setPlayers((prev) =>
        prev
          ? prev.map((player) =>
              player.name === name
                ? { ...player, pos: { x, y, center: positionCenter }, teamKey: team.key }
                : player
            )
          : prev
      )
    }
  }

  const handleRestart = () => {
    setPlayers((prev) =>
      prev
        ? prev.map((player) => ({
            ...player,
            pos: null,
            teamKey: undefined,
          }))
        : prev
    )
    closeRestart()
  }

  const handleReset = () => {
    setPlayers(null)
    router.push(Routes.Home())
  }

  const handleRemove = (deletedName) => {
    setPlayers((prev) => (prev ? prev.filter(({ name }) => name !== deletedName) : prev))
  }

  const resolveTeam = (posY) => {
    if (mid.current) {
      const all = mid.current.getBoundingClientRect()
      return posY < all.top ? TEAMS.A : TEAMS.B
    }

    return TEAMS.A
  }

  const handleStopDrag = (e, draggedName, data, draggedFromOutside = false) => {
    toggleDeleteMode()
    if (dropZone.current && e.target) {
      const { bottom, top } = dropZone.current.getBoundingClientRect()
      const { bottom: draggedBottom } = e.target.getBoundingClientRect()

      if (bottom >= draggedBottom && top <= draggedBottom) {
        handleRemove(draggedName)
      } else {
        const dragged = draggedFromOutside ? e.target.getBoundingClientRect() : data
        handleUpdate(draggedName, dragged)
      }
    }
  }

  const handleDownload = () => {
    if (!wTeam || !mid.current || !wTeam.length || !containerRef.current) {
      return
    }

    toPng(containerRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a")
        link.download = "my-image-name.png"
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleWPP = () => {
    if (!wTeam || !mid.current || !wTeam.length || !containerRef.current) {
      return
    }

    const teamA = wTeam
      .filter(({ teamKey }) => teamKey === TEAMS.A.key)
      .sort((a, b) => a.pos.center - b.pos.center)

    const teamB = wTeam
      .filter(({ teamKey }) => teamKey === TEAMS.B.key)
      .sort((a, b) => a.pos.center - b.pos.center)

    const text = `
    ${teamA.map(({ name }) => name).join("\n")}\n--------------------\n${teamB
      .map(({ name }) => name)
      .join("\n")}
    `.trim()

    const link = document.createElement("a")
    link.href = `https://wa.me/?text=${encodeURIComponent(text)}`
    link.target = "_blank"
    link.click()
  }

  return (
    <>
      <Container
        ref={containerRef}
        bg={colors.green[0]}
        sx={{
          padding: 0,
          height: "90%",
          maxWidth: "100%",
          position: "relative",
        }}
      >
        <hr
          style={{
            height: 2,
            top: "50%",
            width: "100%",
            border: "none",
            position: "absolute",
            backgroundColor: white,
          }}
          ref={mid}
        />
        <div
          style={{
            left: "50%",
            width: "40%",
            height: "7%",
            position: "absolute",
            border: `2px solid ${white}`,
            transform: "translateX(-50%)",
            borderTop: "none",
          }}
        />
        <div
          style={{
            bottom: 0,
            left: "50%",
            width: "40%",
            height: "7%",
            position: "absolute",
            border: `2px solid ${white}`,
            transform: "translateX(-50%)",
            borderBottom: "none",
          }}
        />
        {hasPlayers &&
          wTeam.map(({ name, pos, teamKey }, index) => (
            <Draggable
              defaultPosition={pos || { x: 0, y: index * 20 }}
              key={name}
              onStart={() => toggleDeleteMode()}
              onStop={(e, data) => handleStopDrag(e, name, data)}
            >
              <Group
                sx={{
                  width: "fit-content",
                }}
              >
                <IconShirt color={TEAMS[teamKey!].color} />
                <Text
                  size="lg"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.3rem",
                  }}
                  c={black}
                  transform="capitalize"
                >
                  {name}
                </Text>
              </Group>
            </Draggable>
          ))}
      </Container>
      {isDeleteMode ? (
        <Group
          ref={dropZone}
          position="center"
          bg={primaryColor}
          sx={{
            gap: 16,
            padding: 16,
            height: "10%",
          }}
        >
          <IconTrash />
        </Group>
      ) : (
        <Group
          position="apart"
          bg={primaryColor}
          sx={{
            gap: 16,
            padding: 16,
            height: "10%",
          }}
        >
          <Button px={16} onClick={open} fullWidth={false} variant="white">
            <IconArrowLeft />
          </Button>
          {hasPlayers && (
            <>
              <Button px={16} onClick={handleDownload} fullWidth={false} variant="white">
                <IconDownload />
              </Button>
              <Button px={16} onClick={handleWPP} fullWidth={false} variant="white">
                <IconBrandWhatsapp />
              </Button>
              <Button px={16} onClick={openRestart} fullWidth={false} variant="white">
                <IconTrash />
              </Button>
            </>
          )}
          <Button px={16} onClick={() => togglePlayersDrawer()} fullWidth={false} variant="white">
            <IconUsersGroup />
          </Button>
        </Group>
      )}
      {playersDrawer && (
        <div
          style={{
            top: 0,
            bottom: 0,
            right: 0,
            width: "50%",
            padding: 16,
            position: "fixed",
            backgroundColor: black,
          }}
        >
          <Flex ref={drawerRef} direction="column" h="100%" gap="md" justify="flex-end">
            {withoutTeam &&
              withoutTeam.length > 0 &&
              withoutTeam.map(({ name, pos }) => (
                <Draggable
                  defaultPosition={pos || { x: 0, y: 0 }}
                  key={name}
                  onStart={() => toggleDeleteMode()}
                  onStop={(e, data) => handleStopDrag(e, name, data, true)}
                >
                  <Group
                    sx={{
                      width: "fit-content",
                    }}
                  >
                    <Text
                      size="md"
                      c={white}
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.3rem",
                      }}
                      transform="capitalize"
                    >
                      {name}
                    </Text>
                  </Group>
                </Draggable>
              ))}
            {isCreateMode ? (
              <form onSubmit={form.onSubmit(handleCreate)}>
                <Flex gap="xs">
                  <TextInput
                    size="md"
                    autoFocus
                    wrapperProps={{
                      sx: {
                        flex: 1,
                        flexGrow: 1,
                      },
                    }}
                    {...form.getInputProps("name")}
                  />
                  <Button
                    py={2}
                    px={4}
                    sx={{
                      height: "auto",
                    }}
                    type="submit"
                    fullWidth={false}
                    variant="white"
                  >
                    <IconCheck />
                  </Button>
                </Flex>
              </form>
            ) : (
              <Button px={16} onClick={() => toggleCreateMode()} fullWidth={false} variant="white">
                <IconUserPlus />
              </Button>
            )}
          </Flex>
        </div>
      )}
      <Modal
        centered
        opened={opened}
        onClose={close}
        withCloseButton={false}
        title={
          <Text weight="bold">
            Al volver atras se perdera el equipo que estas creando actualmente
          </Text>
        }
      >
        <Group
          sx={{
            gap: 16,
          }}
        >
          <Text>Estas seguro?</Text>
          <Button onClick={close} variant="outline" p={4}>
            Cancelar
          </Button>
          <Button onClick={handleReset} p={4}>
            Si, volver atras
          </Button>
        </Group>
      </Modal>
      <Modal
        centered
        opened={modalRestart}
        onClose={closeRestart}
        withCloseButton={false}
        title={
          <Text weight="bold">
            Se van a quitar los jugadores de los equipos para que puedas armarlos de cero
          </Text>
        }
      >
        <Group
          sx={{
            gap: 16,
          }}
        >
          <Text>Estas seguro?</Text>
          <Button onClick={closeRestart} variant="outline" p={4}>
            Cancelar
          </Button>
          <Button onClick={handleRestart} p={4}>
            Si, limpiar equipos
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default Builder
