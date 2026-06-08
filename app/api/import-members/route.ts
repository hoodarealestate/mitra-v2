import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import members from '@/lib/members_data.json'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    let inserted = 0
    let skipped = 0
    const errors: string[] = []

    // Insert in batches of 50
    const batchSize = 50
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize)
      const { data, error } = await supabase
        .from('member_migration')
        .upsert(batch, { onConflict: 'email', ignoreDuplicates: true })

      if (error) {
        errors.push(`Batch ${i}-${i + batchSize}: ${error.message}`)
      } else {
        inserted += batch.length
      }
    }

    // Get final count
    const { count } = await supabase
      .from('member_migration')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      total_in_db: count,
      processed: inserted,
      errors: errors.length > 0 ? errors : null
    })

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
