import { compressImage } from '@/lib/image'

// --- browser API mocks for node environment ---

const mockDrawImage = jest.fn()
const mockToBlob = jest.fn()
const mockGetContext = jest.fn(() => ({ drawImage: mockDrawImage }))

function makeMockCanvas(width = 0, height = 0) {
  return { getContext: mockGetContext, toBlob: mockToBlob, width, height }
}

const mockCreateElement = jest.fn((tag: string) => {
  if (tag === 'canvas') return makeMockCanvas()
  return {}
})

;(global as any).document = { createElement: mockCreateElement }
;(global as any).URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn()
}

let mockImageWidth = 400
let mockImageHeight = 300

class MockImage {
  onload: (() => void) | null = null
  onerror: ((e: unknown) => void) | null = null
  width = mockImageWidth
  height = mockImageHeight
  set src(_url: string) {
    this.width = mockImageWidth
    this.height = mockImageHeight
    Promise.resolve().then(() => this.onload?.())
  }
}
;(global as any).Image = MockImage

const MOCK_DATA_URL = 'data:image/jpeg;base64,bW9ja2Jhc2U2NA=='
const MOCK_BASE64 = 'bW9ja2Jhc2U2NA=='

class MockFileReader {
  onloadend: (() => void) | null = null
  result: string = MOCK_DATA_URL
  readAsDataURL(_blob: Blob) {
    Promise.resolve().then(() => this.onloadend?.())
  }
}
;(global as any).FileReader = MockFileReader

// Make toBlob call its callback with a real Blob by default
function setupToBlob(blob: Blob | null = new Blob(['mock'])) {
  mockToBlob.mockImplementation((cb: (b: Blob | null) => void) => cb(blob))
}

beforeEach(() => {
  jest.clearAllMocks()
  mockImageWidth = 400
  mockImageHeight = 300
  setupToBlob()
  // Reset canvas mock to return fresh canvas each call
  mockCreateElement.mockImplementation((tag: string) => {
    if (tag === 'canvas') return makeMockCanvas()
    return {}
  })
})

// -----------------------------------------------

describe('compressImage', () => {
  it('returns base64 string and mimeType image/jpeg', async () => {
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    const result = await compressImage(file)

    expect(result.mimeType).toBe('image/jpeg')
    expect(typeof result.base64).toBe('string')
    expect(result.base64).toBe(MOCK_BASE64)
  })

  it('does not scale down images narrower than 800px', async () => {
    mockImageWidth = 400
    mockImageHeight = 300
    let capturedCanvas: { width: number; height: number } | null = null
    mockCreateElement.mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        capturedCanvas = makeMockCanvas()
        return capturedCanvas
      }
      return {}
    })

    const file = new File(['content'], 'small.jpg', { type: 'image/jpeg' })
    await compressImage(file)

    expect(capturedCanvas!.width).toBe(400)
    expect(capturedCanvas!.height).toBe(300)
  })

  it('scales down images wider than 800px proportionally', async () => {
    mockImageWidth = 1600
    mockImageHeight = 900
    let capturedCanvas: { width: number; height: number } | null = null
    mockCreateElement.mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        capturedCanvas = makeMockCanvas()
        return capturedCanvas
      }
      return {}
    })

    const file = new File(['content'], 'large.jpg', { type: 'image/jpeg' })
    await compressImage(file)

    // scale = 800/1600 = 0.5 → 800×450
    expect(capturedCanvas!.width).toBe(800)
    expect(capturedCanvas!.height).toBe(450)
  })

  it('calls drawImage on the canvas context', async () => {
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    await compressImage(file)
    expect(mockDrawImage).toHaveBeenCalledTimes(1)
  })

  it('revokes the object URL after image loads', async () => {
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    await compressImage(file)
    expect((global as any).URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('rejects when canvas toBlob returns null', async () => {
    setupToBlob(null)
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    await expect(compressImage(file)).rejects.toThrow('Canvas toBlob failed')
  })
})
