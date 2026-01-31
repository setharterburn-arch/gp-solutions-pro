import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export async function POST(request: NextRequest) {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    return NextResponse.json(
      { error: 'Twilio not configured' },
      { status: 500 }
    )
  }

  try {
    const { to, customerName, jobTitle, scheduledDate, scheduledTime, address } = await request.json()

    const message = await client.messages.create({
      body: `Hi ${customerName}! This is a reminder that you have an appointment scheduled:\n\n` +
            `📋 ${jobTitle}\n` +
            `📅 ${scheduledDate} at ${scheduledTime}\n` +
            `📍 ${address}\n\n` +
            `Reply CONFIRM to confirm or call us to reschedule.\n\n` +
            `- GP Solutions`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })

    return NextResponse.json({
      success: true,
      messageId: message.sid,
    })
  } catch (error: any) {
    console.error('Twilio error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
