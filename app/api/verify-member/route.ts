import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, full_name, city, province, postal_code, phone, faith, password } = await req.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    // Check if already registered
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .ilike('email', email.trim())
      .maybeSingle()

    if (existingProfile) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 400 })
    }

    // Check if in member_migration (existing BD member OR paid $1)
    const { data: existingMember } = await supabase
      .from('member_migration')
      .select('*')
      .ilike('email', email.trim())
      .maybeSingle()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id
    const isVerified = !!existingMember
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    // Upsert full profile
    await supabase.from('profiles').upsert({
      id: userId,
      email: email.trim().toLowerCase(),
      full_name,
      city: city || existingMember?.city || null,
      province: province || existingMember?.province || null,
      postal_code: postal_code || null,
      phone: phone || existingMember?.phone || null,
      faith: faith || null,
      is_verified: isVerified,
      member_since: existingMember?.migrated_at || new Date().toISOString(),
      membership_expires_at: isVerified ? expiresAt.toISOString() : null,
      bd_id: existingMember?.bd_id || null,
      role: 'member',
    })

    return NextResponse.json({
      success: true,
      is_verified: isVerified,
      is_existing_member: !!existingMember,
      message: isVerified
        ? 'Welcome back! Your account is verified.'
        : 'Account created! Pay $1 to verify your identity.',
    })

  } catch (err: any) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
