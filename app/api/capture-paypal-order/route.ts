import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json()
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

    if (data.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        transactionId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        status: data.status,
      })
    }

    console.error('PayPal capture failed:', data)
    return NextResponse.json({ error: 'Payment capture failed', details: data }, { status: 500 })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
