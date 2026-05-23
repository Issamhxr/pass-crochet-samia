import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  return session && session.value === process.env.ADMIN_SESSION_TOKEN
}

async function readSettings() {
  try {
    const content = await readFile(SETTINGS_PATH, 'utf-8')
    return JSON.parse(content)
  } catch {
    return { paypal: { clientId: '', clientSecret: '', mode: 'sandbox' } }
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const settings = await readSettings()
  // Mask the secret for the response
  if (settings.paypal?.clientSecret) {
    settings.paypal.clientSecretMasked = '••••••••' + settings.paypal.clientSecret.slice(-4)
    delete settings.paypal.clientSecret
  }
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const current = await readSettings()
    const updated = { ...current, ...body }

    // Don't overwrite secret if it comes back masked
    if (body.paypal?.clientSecret?.startsWith('••')) {
      updated.paypal.clientSecret = current.paypal?.clientSecret || ''
    }

    await mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    await writeFile(SETTINGS_PATH, JSON.stringify(updated, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings save error:', error)
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
  }
}
