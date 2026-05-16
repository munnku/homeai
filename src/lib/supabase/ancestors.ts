import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

type DBClient = SupabaseClient<Database>

/**
 * Batch-fetches ancestor name paths for multiple parent IDs.
 * Reduces N×depth individual queries to ~depth round-trips by fetching all
 * ancestors level-by-level in bulk.
 */
export async function getAncestorNamesBatch(
  supabase: DBClient,
  parentIds: (string | null)[]
): Promise<Map<string | null, string[]>> {
  const result = new Map<string | null, string[]>()
  const nodeMap = new Map<string, { name: string; parent_id: string | null }>()
  const allQueued = new Set<string>()

  for (const id of parentIds) {
    if (id) allQueued.add(id)
  }

  if (allQueued.size === 0) {
    for (const id of parentIds) result.set(id, [])
    return result
  }

  let toFetch = [...allQueued]

  while (toFetch.length > 0) {
    const { data, error } = await supabase
      .from('nodes')
      .select('id, name, parent_id')
      .in('id', toFetch)

    if (error) throw new Error(`ancestors fetch failed: ${error.message}`)
    if (!data?.length) break

    const nextFetch: string[] = []
    for (const node of data) {
      nodeMap.set(node.id, { name: node.name, parent_id: node.parent_id })
      if (node.parent_id && !allQueued.has(node.parent_id)) {
        allQueued.add(node.parent_id)
        nextFetch.push(node.parent_id)
      }
    }
    toFetch = nextFetch
  }

  for (const parentId of parentIds) {
    if (result.has(parentId)) continue
    if (!parentId) { result.set(null, []); continue }

    const path: string[] = []
    let currentId: string | null = parentId
    while (currentId) {
      const node = nodeMap.get(currentId)
      if (!node) break
      path.unshift(node.name)
      currentId = node.parent_id
    }
    result.set(parentId, path)
  }

  return result
}
