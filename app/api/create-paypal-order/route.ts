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
    const { items, customer } = await request.json()

    // Calculate totals server-side
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )
    const tax = subtotal * 0.2
    const total = subtotal + tax

    const accessToken = await getAccessToken()

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `order-${Date.now()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: 'Pass-Crochet Samia — Créations au crochet',
            amount: {
              currency_code: 'EUR',
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: 'EUR', value: subtotal.toFixed(2) },
                tax_total: { currency_code: 'EUR', value: tax.toFixed(2) },
                shipping: { currency_code: 'EUR', value: '0.00' },
              },
            },
            items: items.map((item: { name: string; price: number; quantity: number; id: string }) => ({
              name: item.name.substring(0, 127),
              unit_amount: { currency_code: 'EUR', value: item.price.toFixed(2) },
              quantity: String(item.quantity),
              category: 'PHYSICAL_GOODS',
            })),
            shipping: {
              name: { full_name: `${customer.firstName} ${customer.lastName}` },
              address: {
                address_line_1: customer.address,
                admin_area_2: customer.city,
                postal_code: customer.zipCode,
                country_code: 'FR',
              },
            },
          },
        ],
        application_context: {
          brand_name: 'Pass-Crochet Samia',
          landing_page: 'LOGIN',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          return_url: `${request.nextUrl.origin}/success`,
          cancel_url: `${request.nextUrl.origin}/checkout`,
        },
      }),
    })

    const order = await res.json()

    if (order.id) {
      return NextResponse.json({ orderID: order.id })
    }

    console.error('PayPal order creation failed:', order)
    return NextResponse.json({ error: 'PayPal order creation failed', details: order }, { status: 500 })
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
