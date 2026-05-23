import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  return session && session.value === process.env.ADMIN_SESSION_TOKEN
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

const DEFAULT_SETTINGS = { paypal: { clientId: '', clientSecret: '', mode: 'sandbox' } }

async function readSettings() {
  try {
    const { data } = await getSupabase()
      .from('settings')
      .select('value')
      .eq('key', 'main')
      .single()
    return data?.value || DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const settings = await readSettings()
  const response = JSON.parse(JSON.stringify(settings))
  if (response.paypal?.clientSecret) {
    response.paypal.clientSecretMasked = '••••••••' + response.paypal.clientSecret.slice(-4)
    delete response.paypal.clientSecret
  }
  return NextResponse.json(response)
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const current = await readSettings()
    const updated = { ...current, ...body }

    if (body.paypal?.clientSecret?.startsWith('••')) {
      updated.paypal.clientSecret = current.paypal?.clientSecret || ''
    }

    await getSupabase()
      .from('settings')
      .upsert({ key: 'main', value: updated, updated_at: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings save error:', error)
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
  }
}
