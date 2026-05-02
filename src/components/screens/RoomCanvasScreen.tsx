'use client'

import { useState, useEffect, useRef } from 'react'
import { expiryStatus, type Room, type Furniture, type CanvasPos, type FlatItem } from '@/lib/data'
import { getFurnitureIcon } from '@/components/ui/Icons'
import { Header } from '@/components/ui/Header'
import { CanvasEngine } from '@/components/canvas/CanvasEngine'
import { CanvasTile } from '@/components/canvas/CanvasTile'
import { EdgeHandles } from '@/components/canvas/EdgeHandles'
import { EditModeButton } from '@/components/canvas/EditModeButton'
import { AddTileButton } from '@/components/canvas/AddTileModal'
import type { HighlightState } from '@/components/canvas/CanvasTile'

interface FurnitureTile {
  id: string
  name: string
  icon: string
  pos: CanvasPos
  furnitureRef: Furniture | null
}

interface Props {
  room: Room
  onBack: () => void
  onFurnitureClick: (furniture: Furniture) => void
  onItemClick: (item: FlatItem) => void
  highlightFurnitureId?: string
}

function FurnitureIcon({ iconKey, size }: { iconKey: string; size: number }) {
  const Icon = getFurnitureIcon(iconKey)
  return <Icon size={size} color="#7A4820" />
}

// Derive an icon key from furniture name
function guessIcon(name: string): string {
  const n = name
  if (n.includes('ソファ') || n.includes('sofa')) return 'sofa'
  if (n.includes('机') || n.includes('デスク') || n.includes('テーブル')) return 'desk'
  if (n.includes('ベッド') || n.includes('bed')) return 'bed'
  if (n.includes('棚') || n.includes('shelf') || n.includes('収納')) return 'shelf'
  if (n.includes('冷蔵') || n.includes('fridge')) return 'fridge'
  if (n.includes('引き出し') || n.includes('タンス') || n.includes('クローゼット')) return 'drawer'
  return 'shelf'
}

export function RoomCanvasScreen({ room, onBack, onFurnitureClick, onItemClick, highlightFurnitureId }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [tiles, setTiles] = useState<FurnitureTile[]>(
    () => room.furniture.map(f => ({
      id: f.id,
      name: f.name,
      icon: guessIcon(f.name),
      pos: f.canvasPos,
      furnitureRef: f,
    }))
  )

  // Highlight state management
  const [highlightStates, setHighlightStates] = useState<Record<string, HighlightState>>({})
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!highlightFurnitureId) return
    setHighlightStates({ [highlightFurnitureId]: 'pulsing' })
    // After 3 pulses × 800ms = 2400ms, switch to highlighted
    highlightTimerRef.current = setTimeout(() => {
      setHighlightStates({ [highlightFurnitureId]: 'highlighted' })
    }, 2400)
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    }
  }, [highlightFurnitureId])

  const tilePosArr = tiles.map(t => t.pos)

  function moveFurniture(id: string, newPos: CanvasPos) {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, pos: newPos } : t))
  }

  function resizeFurniture(id: string, newPos: CanvasPos) {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, pos: newPos } : t))
  }

  function addFurniture(name: string, icon: string, pos: CanvasPos) {
    const id = `furniture-${Date.now()}`
    setTiles(prev => [...prev, { id, name, icon, pos, furnitureRef: null }])
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Header title={room.name} onBack={onBack} />

      <div style={{ flex: 1, position: 'relative' }}>
        <CanvasEngine tiles={tilePosArr} editMode={editMode}>
          {tiles.map(tile => {
            const highlight = highlightStates[tile.id] ?? 'none'
            const hasAlert = tile.furnitureRef?.items
              .some(i => expiryStatus(i.expiry) === 'red') ?? false

            const itemCount = tile.furnitureRef?.items.length ?? 0

            return (
              <CanvasTile
                key={tile.id}
                pos={tile.pos}
                label={tile.name}
                icon={<FurnitureIcon iconKey={tile.icon} size={tile.pos.h >= 2 ? 22 : 16} />}
                badge={itemCount > 0 ? `${itemCount}点` : undefined}
                hasAlert={hasAlert}
                highlight={highlight}
                onTap={tile.furnitureRef ? () => onFurnitureClick(tile.furnitureRef!) : undefined}
                onMove={(newPos) => moveFurniture(tile.id, newPos)}
              >
                {editMode && (
                  <EdgeHandles pos={tile.pos} onResize={(newPos) => resizeFurniture(tile.id, newPos)} />
                )}
              </CanvasTile>
            )
          })}
        </CanvasEngine>

        <EditModeButton editMode={editMode} onToggle={() => setEditMode(p => !p)} />
        {editMode && <AddTileButton kind="furniture" onAdd={addFurniture} />}
      </div>
    </div>
  )
}
