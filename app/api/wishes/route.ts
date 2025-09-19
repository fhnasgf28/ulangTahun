import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    console.log('GET /api/wishes - fetching wishes')
    // order by id (timestamp strings) instead of createdAt to avoid schema mismatch if createdAt column doesn't exist
    const { data, error } = await supabaseAdmin.from('wishes').select('*').order('id', { ascending: false })
    if (error) {
      console.error('Supabase GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET handler unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('POST /api/wishes body:', body)
    const text = (body?.text || '').toString().trim()
    if (!text) {
      console.warn('POST missing text')
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    // Do not insert createdAt to avoid errors if column missing; DB can set default if configured
    const newItem = { id: Date.now().toString(), text, status: 'todo' }
    const { data, error } = await supabaseAdmin.from('wishes').insert(newItem).select().single()
    if (error) {
      console.error('Supabase INSERT error:', error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }
    console.log('Inserted item id:', data?.id)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('POST handler unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    console.log('PUT /api/wishes body:', body)
    const { id, status } = body || {}
    if (!id || !status) {
      console.warn('PUT missing id or status')
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('wishes').update({ status }).eq('id', id)
    if (error) {
      console.error('Supabase UPDATE error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PUT handler unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    console.log('DELETE /api/wishes body:', body)
    const { id } = body || {}
    if (!id) {
      console.warn('DELETE missing id')
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('wishes').delete().eq('id', id)
    if (error) {
      console.error('Supabase DELETE error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE handler unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
