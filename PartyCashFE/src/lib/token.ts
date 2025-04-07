// src/lib/token.ts
export function isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      return payload.exp && payload.exp < now
    } catch {
      return true // Treat invalid token as expired
    }
  }
  