export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'mafia':
      return '#ef4444'
    case 'sheriff':
      return '#f59e0b'
    case 'don':
      return '#dc2626'
    default:
      return '#10b981'
  }
}
