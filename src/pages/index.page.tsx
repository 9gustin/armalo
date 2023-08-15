import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { UserInfo } from "./auth/components/UserInfo"
import { useCurrentUser } from "@/users/hooks/useCurrentUser"
import AuthForm from "./auth/components/AuthForm"

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser()

  return (
    <Layout title="Home">
      <Suspense fallback="Loading...">{currentUser ? <UserInfo /> : <AuthForm />}</Suspense>
    </Layout>
  )
}

export default Home
