import Head from "next/head"
import React, { Suspense } from "react"
import { BlitzLayout } from "@blitzjs/next"
import { Group } from "@mantine/core"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "armalo"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Group
        dir="column"
        align="center"
        p={16}
        sx={{
          gap: 16,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Suspense fallback="Loading...">{children}</Suspense>
      </Group>
    </>
  )
}

export default Layout
