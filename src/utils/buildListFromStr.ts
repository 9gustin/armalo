export const isValid = (str: string, ignoreFirstLine): boolean =>
  buildListFromStr(str, ignoreFirstLine).length > 0

export const buildListFromStr = (str, ignoreFirstLine) => {
  const lines = str.split("\n")

  const players = lines
    .filter(Boolean)
    .map((line) =>
      line.includes("-") ? { name: line.split("-")[1].trim() } : { name: line.trim() }
    )

  if (ignoreFirstLine) {
    players.shift()
  }

  return players
}
