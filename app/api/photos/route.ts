import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'dinda')
  try {
    const files = await fs.readdir(dir)
    const images = files.filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f)).map((f) => `/dinda/${f}`)
    return NextResponse.json(images)
  } catch (e) {
    // If folder doesn't exist or error, return empty array
    return NextResponse.json([], { status: 200 })
  }
}
