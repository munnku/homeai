export interface Item {
  id: string
  name: string
  tags: string[]
  photo?: string | null
  expiry?: string
  count?: number
}

export interface Furniture {
  id: string
  name: string
  canvasPos: CanvasPos
  items: Item[]
}

export interface CanvasPos {
  x: number  // left edge, in grid units (0-based)
  y: number  // top edge, in grid units (0-based)
  w: number  // width, in grid units
  h: number  // height, in grid units
}

export interface Room {
  id: string
  name: string
  icon: string
  canvasPos: CanvasPos
  itemCount: number
  furniture: Furniture[]
}

export const SAMPLE_DATA: { household: string; rooms: Room[] } = {
  household: '田中家',
  rooms: [
    {
      id: 'living', name: 'リビング', icon: 'living',
      canvasPos: { x: 0, y: 0, w: 6, h: 6 }, itemCount: 34,
      furniture: [
        { id: 'tv-shelf', name: 'テレビ台', canvasPos: { x: 0, y: 0, w: 4, h: 2 }, items: [
          { id: 'i1', name: 'リモコン（テレビ）', tags: ['電気製品'] },
          { id: 'i2', name: 'リモコン（エアコン）', tags: ['電気製品'] },
          { id: 'i3', name: 'HDMIケーブル', tags: ['ケーブル'] },
        ]},
        { id: 'side-table', name: 'サイドテーブル', canvasPos: { x: 5, y: 0, w: 2, h: 2 }, items: [
          { id: 'i4', name: '単3電池（4本）', tags: ['消耗品'], count: 4 },
          { id: 'i5', name: '充電器', tags: ['電気製品'] },
        ]},
      ],
    },
    {
      id: 'kitchen', name: 'キッチン', icon: 'kitchen',
      canvasPos: { x: 6, y: 0, w: 6, h: 3 }, itemCount: 52,
      furniture: [
        { id: 'refrigerator', name: '冷蔵庫', canvasPos: { x: 0, y: 0, w: 2, h: 3 }, items: [
          { id: 'i6', name: '牛乳', tags: ['食品'], expiry: '2026-05-04' },
          { id: 'i7', name: '卵（6個）', tags: ['食品'], expiry: '2026-05-08', count: 6 },
        ]},
        { id: 'cabinet-top', name: '食器棚（上段）', canvasPos: { x: 3, y: 0, w: 4, h: 2 }, items: [
          { id: 'i8', name: 'お茶碗', tags: ['食器'], count: 4 },
          { id: 'i9', name: 'マグカップ', tags: ['食器'], count: 3 },
        ]},
      ],
    },
    {
      id: 'bedroom', name: '寝室', icon: 'bedroom',
      canvasPos: { x: 0, y: 6, w: 6, h: 3 }, itemCount: 18,
      furniture: [
        { id: 'wardrobe', name: 'クローゼット', canvasPos: { x: 0, y: 0, w: 4, h: 5 }, items: [
          { id: 'i10', name: '冬用コート（黒）', tags: ['衣類'] },
          { id: 'i11', name: 'スーツ', tags: ['衣類'] },
        ]},
      ],
    },
    {
      id: 'bathroom', name: '洗面所', icon: 'bathroom',
      canvasPos: { x: 6, y: 3, w: 3, h: 3 }, itemCount: 21,
      furniture: [
        { id: 'cabinet', name: '洗面台下収納', canvasPos: { x: 1, y: 1, w: 4, h: 2 }, items: [
          { id: 'i12', name: 'シャンプー（詰め替え）', tags: ['日用品'], count: 2 },
          { id: 'i13', name: '歯ブラシ（詰め替え）', tags: ['日用品'], count: 3 },
        ]},
      ],
    },
    {
      id: 'child', name: '子供部屋', icon: 'child',
      canvasPos: { x: 9, y: 3, w: 3, h: 6 }, itemCount: 47,
      furniture: [
        { id: 'toy-box', name: 'おもちゃ箱', canvasPos: { x: 1, y: 0, w: 4, h: 3 }, items: [
          { id: 'i14', name: 'レゴブロック', tags: ['おもちゃ'] },
          { id: 'i15', name: 'ボールペン', tags: ['おもちゃ'] },
        ]},
      ],
    },
    {
      id: 'storage', name: '納戸', icon: 'storage',
      canvasPos: { x: 6, y: 6, w: 3, h: 3 }, itemCount: 63,
      furniture: [
        { id: 'shelf-a', name: '棚A', canvasPos: { x: 0, y: 0, w: 5, h: 4 }, items: [
          { id: 'i16', name: '掃除機', tags: ['家電'] },
          { id: 'i17', name: 'アイロン', tags: ['家電'] },
        ]},
      ],
    },
  ],
}

export function daysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null
  const diff = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  return Math.ceil(diff)
}

export type ExpiryStatus = 'red' | 'yellow' | 'ok'

export function expiryStatus(dateStr?: string): ExpiryStatus | null {
  const days = daysUntilExpiry(dateStr)
  if (days === null) return null
  if (days <= 2) return 'red'
  if (days <= 7) return 'yellow'
  return 'ok'
}

export type FlatItem = Item & {
  path: string
  roomIcon: string
  roomId: string
  furnitureId: string
  furnitureName: string
  roomName: string
}

export const ALL_ITEMS_FLAT: FlatItem[] = SAMPLE_DATA.rooms.flatMap(room =>
  room.furniture.flatMap(f =>
    f.items.map(item => ({
      ...item,
      path: `${room.name} › ${f.name}`,
      roomIcon: room.icon,
      roomId: room.id,
      furnitureId: f.id,
      furnitureName: f.name,
      roomName: room.name,
    }))
  )
)
