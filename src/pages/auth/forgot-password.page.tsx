import Layout from "src/core/layouts/Layout"
import forgotPassword from "src/auth/mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { useForm } from "@mantine/form"
import { TextInput } from "@mantine/core"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  const form = useForm({
    initialValues: {
      email: "",
    },
  })

  const handleSubmit = (values) => {
    return forgotPasswordMutation(values)
  }

  return (
    <Layout title="Forgot Your Password?">
      <h1>Forgot your password?</h1>

      {isSuccess ? (
        <div>
          <h2>Request Submitted</h2>
          <p>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput withAsterisk label="Email" {...form.getInputProps("email")} />
        </form>
      )}
    </Layout>
  )
}

export default ForgotPasswordPage
