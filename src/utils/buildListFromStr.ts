export const isValid = (str: string, ignoreFirstLine): boolean =>
  buildListFromStr(str, ignoreFirstLine).length > 0

export const buildListFromStr = (str, ignoreFirstLine) => {
  const players = str
    .trim()
    .replace(/[^a-zA-Z\n]+/g, "")
    .split("\n")
    .filter((hasValue) => hasValue)

  if (ignoreFirstLine) {
    players.shift()
  }

  return players.map((name) => ({ name }))
}
