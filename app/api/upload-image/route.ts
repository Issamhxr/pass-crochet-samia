import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  return session && session.value === process.env.ADMIN_SESSION_TOKEN
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const target = formData.get('target') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop grand. Maximum 5MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = target || `upload-${Date.now()}.${ext}`
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '-')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error } = await supabase.storage
      .from('images')
      .upload(safeFilename, buffer, { contentType: file.type, upsert: true })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: 'Erreur upload: ' + error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(safeFilename)
    return NextResponse.json({ path: urlData.publicUrl, filename: safeFilename })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Erreur lors du téléchargement' }, { status: 500 })
  }
}
