import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

async function isAdmin(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  return profile?.role === 'admin'
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

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
    const safeBase = file.name
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .slice(0, 40) || 'image'
    const filename = `${safeBase}-${Date.now()}.${ext}`

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    )

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error } = await supabase.storage
      .from('images')
      .upload(filename, buffer, { contentType: file.type, upsert: true })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: 'Erreur upload: ' + error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filename)
    return NextResponse.json({ path: urlData.publicUrl, filename })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error?.message || 'Erreur lors du téléchargement' }, { status: 500 })
  }
}
