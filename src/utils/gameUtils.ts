import { Player, Role } from '../types/game'

export const generatePlayerNames = (count: number): string[] => {
  const names: string[] = []
  for (let i = 1; i <= count; i++) {
    names.push(`Игрок ${i}`)
  }
  return names
}

export const distributeRoles = (playerCount: number): Role[] => {
  const roles: Role[] = []

  // roles.push('mafia')
  roles.push('mafia')
  roles.push('don')
  roles.push('sheriff')

  const civiliansCount = playerCount - roles.length
  for (let i = 0; i < civiliansCount; i++) {
    roles.push('civilian')
  }

  return shuffleArray(roles)
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp!
  }
  return shuffled
}

export const createPlayers = (playerCount: number): Player[] => {
  if (playerCount < 4) {
    throw new Error('Минимальное количество игроков - 4')
  }

  const names = generatePlayerNames(playerCount)
  const roles = distributeRoles(playerCount)

  return names.map((name, index) => ({
    id: index + 1,
    name,
    role: roles[index]!,
    isAlive: true,
  }))
}
