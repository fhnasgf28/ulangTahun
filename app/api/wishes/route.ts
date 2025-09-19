import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('wishes').select('*').order('createdAt', { ascending: false })
  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const text = (body?.text || '').toString().trim()
  if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 })

  const newItem = { id: Date.now().toString(), text, status: 'todo', createdAt: Date.now() }
  const { data, error } = await supabaseAdmin.from('wishes').insert(newItem).select().single()
  if (error) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, status } = body || {}
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

  const { error } = await supabaseAdmin.from('wishes').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body || {}
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('wishes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
