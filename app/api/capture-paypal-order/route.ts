import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PAYPAL_API = process.env.PAYPAL_API_BASE ?? 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  if (!data.access_token) throw new Error('Failed to get PayPal access token')
  return data.access_token
}

function genOrderNumber(): string {
  return 'PCS-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const { orderID, items, customer } = await request.json()
    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })
    }

    const accessToken = await getAccessToken()

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (data.status !== 'COMPLETED') {
      console.error('PayPal capture failed:', data)
      return NextResponse.json({ error: 'Payment capture failed', details: data }, { status: 500 })
    }

    const transactionId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null
    const orderNumber = genOrderNumber()

    // Save the order to Supabase (best-effort; payment already succeeded)
    try {
      const cartItems = Array.isArray(items) ? items : []
      const subtotal = cartItems.reduce((s: number, i: any) => s + (i.price * i.quantity), 0)
      const tax = +(subtotal * 0.2).toFixed(2)
      const total = +(subtotal + tax).toFixed(2)

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies: { getAll() { return request.cookies.getAll() }, setAll() {} } },
      )

      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`.trim() || 'Client',
        customer_email: customer?.email ?? '',
        customer_phone: customer?.phone ?? null,
        shipping_address: {
          address: customer?.address ?? '',
          city: customer?.city ?? '',
          zipCode: customer?.zipCode ?? '',
          country: customer?.country ?? 'France',
        },
        items: cartItems,
        subtotal,
        tax,
        total,
        status: 'pending',
        paypal_transaction_id: transactionId,
        user_id: user?.id ?? null,
      })
    } catch (dbErr) {
      console.error('Order save error (payment succeeded):', dbErr)
    }

    return NextResponse.json({
      success: true,
      transactionId,
      orderNumber,
      status: data.status,
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
