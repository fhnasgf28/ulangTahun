import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'wishes.json')

async function readWishes() {
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    if ((e as any).code === 'ENOENT') {
      await fs.mkdir(path.dirname(FILE), { recursive: true })
      await fs.writeFile(FILE, JSON.stringify([]), 'utf-8')
      return []
    }
    throw e
  }
}

async function writeWishes(wishes: any[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(wishes, null, 2), 'utf-8')
}

export async function GET() {
  const wishes = await readWishes()
  return NextResponse.json(wishes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const text = (body?.text || '').toString().trim()
  if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 })

  const wishes = await readWishes()
  const item = { id: Date.now().toString(), text, status: 'todo', createdAt: Date.now() }
  wishes.unshift(item)
  await writeWishes(wishes)
  return NextResponse.json(item, { status: 201 })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, status } = body || {}
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

  const wishes = await readWishes()
  const updated = wishes.map((w: any) => (w.id === id ? { ...w, status } : w))
  await writeWishes(updated)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body || {}
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const wishes = await readWishes()
  const filtered = wishes.filter((w: any) => w.id !== id)
  await writeWishes(filtered)
  return NextResponse.json({ ok: true })
}
