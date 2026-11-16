import type { GitHubClient } from './client'
import type { ContentFile } from './types'

export interface FileData {
  path: string
  sha: string
  text: string
}

/** Read a file from the repo via the Contents API (works with a read-only token). */
export async function getFile(
  client: GitHubClient,
  path: string,
  ref?: string,
): Promise<FileData> {
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : ''
  const file = await client.request<ContentFile>(`/contents/${path}${query}`)
  return { path: file.path, sha: file.sha, text: decodeBase64(file.content) }
}

/**
 * Create or update a file via the Contents API (requires a write token).
 * Pass the current `sha` to update an existing file, or `null` to create one.
 */
export async function putFile(
  client: GitHubClient,
  path: string,
  text: string,
  sha: string | null,
  message: string,
  branch?: string,
): Promise<{ sha: string }> {
  const body: Record<string, string> = { message, content: encodeBase64(text) }
  if (sha) body.sha = sha
  if (branch) body.branch = branch

  const res = await client.request<{ content: { sha: string } }>(`/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  return { sha: res.content.sha }
}

/** Decode GitHub's base64 (which contains newlines) to a UTF-8 string. */
function decodeBase64(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Encode a UTF-8 string to base64 for the Contents API. */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}
