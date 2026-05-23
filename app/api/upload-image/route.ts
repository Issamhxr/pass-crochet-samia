import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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
    const target = formData.get('target') as string | null // e.g. "product-1.jpg"

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop grand. Maximum 5MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = target || `upload-${Date.now()}.${ext}`

    // Sanitize filename
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '-')

    const imagesDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(imagesDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(path.join(imagesDir, safeFilename), buffer)

    return NextResponse.json({ path: `/images/${safeFilename}`, filename: safeFilename })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Erreur lors du téléchargement' }, { status: 500 })
  }
}
