import { Player } from './types/game'

export const MISS_PLAYER_Id = 1000000000

export const MISS_PLAYER: Player = {
  id: MISS_PLAYER_Id,
  name: 'ПРОМАХ',
  role: 'civilian',
  isAlive: true,
}

export const getMafiaMissedMessage = () => 'Мафия не смогла договориться! Никто не был убит.'
export const getMafiaKilledMessage = (name: string) => `${name} был убит мафией!`
