import { createContext, useContext } from 'react'

interface CanvasCtx {
  zoom: number
  editMode: boolean
}

export const CanvasContext = createContext<CanvasCtx>({ zoom: 1, editMode: false })
export const useCanvasCtx = () => useContext(CanvasContext)
