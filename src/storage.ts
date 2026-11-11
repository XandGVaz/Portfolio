// localStorage pode não existir ou lançar exceção (aba anônima, cookies bloqueados).
export function load(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function save(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sem persistência, tudo bem */
  }
}
