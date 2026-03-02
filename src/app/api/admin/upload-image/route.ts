import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as string | null
  const image = formData.get('image') as File | null

  if (!file || !image) {
    return NextResponse.json({ error: 'Missing file or image' }, { status: 400 })
  }

  const buffer = Buffer.from(await image.arrayBuffer())
  const destPath = path.join(process.cwd(), 'public/quiz-images', file)
  fs.writeFileSync(destPath, buffer)

  return NextResponse.json({ ok: true })
}
