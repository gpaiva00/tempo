function getNextMidNight() {
  const tomorrow = new Date()
  tomorrow.setUTCHours(0, 0, 0, 0)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

  return tomorrow.toISOString().slice(0, -8)
}

export { getNextMidNight }
