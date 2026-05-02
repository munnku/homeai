'use client'

import { useState } from 'react'
import { PhoneShell } from './ui/PhoneShell'
import { TabBar, type Tab } from './ui/TabBar'
import { FloorPlanScreen } from './screens/FloorPlanScreen'
import { SearchScreen } from './screens/SearchScreen'
import { RoomDetailScreen } from './screens/RoomDetailScreen'
import { RoomCanvasScreen } from './screens/RoomCanvasScreen'
import { FurnitureDetailScreen } from './screens/FurnitureDetailScreen'
import { ItemDetailScreen } from './screens/ItemDetailScreen'
import { AddScreen } from './screens/AddScreen'
import { ItemsScreen } from './screens/ItemsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import type { Room, Furniture, FlatItem } from '@/lib/data'

type StackItem =
  | { type: 'room'; room: Room; highlightFurnitureId?: string }
  | { type: 'furniture'; room: Room; furniture: Furniture }
  | { type: 'item'; item: FlatItem }

const slideIn: React.CSSProperties = {
  position: 'absolute', inset: 0,
  background: 'linear-gradient(150deg, #F5EAE0 0%, #FDF8F2 48%, #EDE2D3 100%)',
  animation: 'slideInRight 0.26s cubic-bezier(0.4,0,0.2,1)',
  zIndex: 100,
}


export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [stack, setStack] = useState<StackItem[]>([])
  const [showAdd, setShowAdd] = useState(false)

  function pushRoom(room: Room, highlightFurnitureId?: string) {
    setStack(s => [...s, { type: 'room', room, highlightFurnitureId }])
  }

  function pushFurniture(room: Room, furniture: Furniture) {
    setStack(s => [...s, { type: 'furniture', room, furniture }])
  }

  function pushItem(item: FlatItem) {
    setStack(s => [...s, { type: 'item', item }])
  }

  function pop() {
    setStack(s => s.slice(0, -1))
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    setStack([])
  }

  return (
    <PhoneShell>
      {/* Base layer */}
      {activeTab === 'home' && (
        <FloorPlanScreen onRoomClick={pushRoom} />
      )}
      {activeTab === 'search' && <SearchScreen />}
      {activeTab === 'items' && <ItemsScreen onItemClick={pushItem} />}
      {activeTab === 'settings' && <SettingsScreen />}

      {/* Navigation stack overlays */}
      {stack.map((frame, i) => {
        if (i !== stack.length - 1) return null

        if (frame.type === 'room') {
          return (
            <div key={i} style={slideIn}>
              <RoomCanvasScreen
                room={frame.room}
                onBack={pop}
                onItemClick={pushItem}
                onFurnitureClick={(f) => pushFurniture(frame.room, f)}
                highlightFurnitureId={frame.highlightFurnitureId}
              />
            </div>
          )
        }

        if (frame.type === 'furniture') {
          return (
            <div key={i} style={slideIn}>
              <FurnitureDetailScreen
                room={frame.room}
                furniture={frame.furniture}
                onBack={pop}
                onItemClick={pushItem}
              />
            </div>
          )
        }

        if (frame.type === 'item') {
          return (
            <div key={i} style={slideIn}>
              <ItemDetailScreen item={frame.item} onBack={pop} />
            </div>
          )
        }

        return null
      })}

      {/* Add modal */}
      {showAdd && <AddScreen onClose={() => setShowAdd(false)} />}

      {/* Tab bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAdd={() => setShowAdd(true)}
      />
    </PhoneShell>
  )
}
