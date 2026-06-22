import { useBoardStore, type BoardState } from '~/stores/board'

// 把看板設定編碼成 ?s=<base64> 分享連結；開啟時自動還原
// 預留商業化：未來可換成短碼 / 後端存檔
export function useShareLink() {
  const board = useBoardStore()

  // 產生可分享網址
  function buildUrl(): string {
    const json = JSON.stringify(board.$state)
    const code = btoa(encodeURIComponent(json))
    const base = `${location.origin}${location.pathname}`
    return `${base}?s=${code}`
  }

  // 從網址還原設定（有 s 參數才動作）
  function loadFromUrl(): boolean {
    const params = new URLSearchParams(location.search)
    const code = params.get('s')
    if (!code) return false
    try {
      const json = decodeURIComponent(atob(code))
      board.apply(JSON.parse(json) as Partial<BoardState>)
      board.save()
      return true
    } catch {
      return false
    }
  }

  // 複製分享連結到剪貼簿
  async function copyShareLink(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(buildUrl())
      return true
    } catch {
      return false
    }
  }

  return { buildUrl, loadFromUrl, copyShareLink }
}
