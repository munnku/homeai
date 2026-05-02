'use client'

import { useState } from 'react'
import { PhoneShell } from './ui/PhoneShell'
import { TabBar, type Tab } from './ui/TabBar'
import { HomeScreen } from './screens/HomeScreen'
import { SearchScreen } from './screens/SearchScreen'
import { RoomDetailScreen } from './screens/RoomDetailScreen'
import { ItemDetailScreen } from './screens/ItemDetailScreen'
import { AddScreen } from './screens/AddScreen'
import type { Room, FlatItem } from '@/lib/data'

type StackItem =
  | { type: 'room'; room: Room }
  | { type: 'item'; item: FlatItem }

function AllItemsPlaceholder() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12, color: 'var(--text-tertiary)',
    }}>
      <div style={{ fontSize: 48 }}>📦</div>
      <div style={{ fontWeight: 700, fontSize: 18 }}>全アイテム</div>
      <div style={{ fontSize: 13 }}>準備中…</div>
    </div>
  )
}

function SettingsPlaceholder() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12, color: 'var(--text-tertiary)',
    }}>
      <div style={{ fontSize: 48 }}>⚙️</div>
      <div style={{ fontWeight: 700, fontSize: 18 }}>設定</div>
      <div style={{ fontSize: 13 }}>準備中…</div>
    </div>
  )
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [stack, setStack] = useState<StackItem[]>([])
  const [showAdd, setShowAdd] = useState(false)

  function pushRoom(room: Room) {
    setStack(s => [...s, { type: 'room', room }])
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

  function handleSearchFocus() {
    setActiveTab('search')
    setStack([])
  }

  const top = stack[stack.length - 1]

  return (
    <PhoneShell>
      {/* Base layer: tab content */}
      {activeTab === 'home' && (
        <HomeScreen
          onRoomClick={pushRoom}
          onSearchFocus={handleSearchFocus}
          onAddClick={() => setShowAdd(true)}
        />
      )}
      {activeTab === 'search' && (
        <SearchScreen
          onItemClick={pushItem}
          initialFocus={activeTab === 'search' && stack.length === 0}
        />
      )}
      {activeTab === 'items' && <AllItemsPlaceholder />}
      {activeTab === 'settings' && <SettingsPlaceholder />}

      {/* Stack overlays */}
      {stack.map((frame, i) => {
        const isTop = i === stack.length - 1
        if (!isTop) return null

        if (frame.type === 'room') {
          return (
            <div
              key={i}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(150deg, #F5EAE0 0%, #FDF8F2 48%, #EDE2D3 100%)',
                backgroundAttachment: 'fixed',
                animation: 'slideInRight 0.26s cubic-bezier(0.4,0,0.2,1)',
                zIndex: 100,
              }}
            >
              <RoomDetailScreen
                room={frame.room}
                onBack={pop}
                onItemClick={pushItem}
              />
            </div>
          )
        }

        if (frame.type === 'item') {
          return (
            <div
              key={i}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(150deg, #F5EAE0 0%, #FDF8F2 48%, #EDE2D3 100%)',
                backgroundAttachment: 'fixed',
                animation: 'slideInRight 0.26s cubic-bezier(0.4,0,0.2,1)',
                zIndex: 100,
              }}
            >
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
