import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const { file, candidatePath } = await req.json()

  if (!file || !candidatePath) {
    return NextResponse.json({ error: 'Missing file or candidatePath' }, { status: 400 })
  }

  const srcPath = path.join(process.cwd(), 'public', candidatePath)
  const destPath = path.join(process.cwd(), 'public/quiz-images', file)

  if (!fs.existsSync(srcPath)) {
    return NextResponse.json({ error: 'Source file not found' }, { status: 404 })
  }

  fs.copyFileSync(srcPath, destPath)
  return NextResponse.json({ ok: true })
}
