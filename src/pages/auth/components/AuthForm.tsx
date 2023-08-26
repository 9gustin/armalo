import login from "@/auth/mutations/login"
import signup from "@/auth/mutations/signup"
import { MIN_PASSWORD_LENGTH } from "@/auth/schemas"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useToggle } from "@mantine/hooks"
import Link from "next/link"
import { useRouter } from "next/router"

export default function AuthForm() {
  const router = useRouter()
  const [$login] = useMutation(login)
  const [$signup] = useMutation(signup)
  const [type, toggle] = useToggle(["register", "login"])
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Ingrese un correo válido"),
      password: (val) =>
        val.length < MIN_PASSWORD_LENGTH
          ? `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
          : null,
    },
  })

  const isRegister = type === "register"

  const handleSubmit = async (values) => {
    if (isRegister) {
      await $signup(values)
    } else {
      await $login(values)
    }
    return router.push(Routes.Home())
  }

  return (
    <Container size={420} my={40}>
      <Title align="center">Bienvenido!</Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {isRegister ? "Ya tenes cuenta?" : "No tenes cuenta?"}{" "}
        <Anchor size="sm" component="button" onClick={() => toggle()}>
          {isRegister ? "Ingresá" : "Creá una cuenta"}
        </Anchor>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        {type === "register" && (
          <TextInput
            required
            withAsterisk
            label="Nombre"
            radius="md"
            {...form.getInputProps("name")}
          />
        )}

        <TextInput label="Mail" required withAsterisk mt="md" {...form.getInputProps("email")} />
        <PasswordInput
          label="Contraseña"
          withAsterisk
          required
          mt="md"
          {...form.getInputProps("password")}
        />
        <Group position="apart" mt="lg">
          <Anchor component={Link} size="sm" href={Routes.ForgotPasswordPage()}>
            Olvidaste tu contraseña
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" type="submit">
          Ingresar
        </Button>
      </Paper>
    </Container>
  )
}
