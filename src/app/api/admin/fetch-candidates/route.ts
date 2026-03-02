import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LOCKS = [3, 9, 17, 31]

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://loremflickr.com/',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const file = searchParams.get('file')

  if (!query || !file) {
    return NextResponse.json({ error: 'Missing query or file' }, { status: 400 })
  }

  const tmpDir = path.join(process.cwd(), 'public/quiz-images/tmp')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

  // loremflickr only accepts comma-separated keywords — no spaces allowed
  const safeQuery = query.replace(/\s+/g, ',').replace(/,+/g, ',')

  const candidates: string[] = []

  for (const lock of LOCKS) {
    const tmpFile = `${file.replace('.jpg', '')}-${lock}.jpg`
    const tmpPath = path.join(tmpDir, tmpFile)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(
        `https://loremflickr.com/800/600/${encodeURIComponent(safeQuery)}?lock=${lock}`,
        { redirect: 'follow', headers: BROWSER_HEADERS, signal: controller.signal }
      )
      clearTimeout(timeout)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const contentType = res.headers.get('content-type') ?? ''
      if (!contentType.startsWith('image/')) throw new Error(`Not an image: ${contentType}`)

      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length < 1000) throw new Error(`File too small: ${buffer.length} bytes`)

      fs.writeFileSync(tmpPath, buffer)
      candidates.push(`/quiz-images/tmp/${tmpFile}`)
    } catch (err) {
      console.error(`Failed lock ${lock} for ${file}:`, err)
      candidates.push('')
    }
  }

  return NextResponse.json({ candidates })
}
