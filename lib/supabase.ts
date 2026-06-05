import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const ZEFFY_LINKS = {
  memberVerification: 'https://www.zeffy.com/en-CA/ticketing/member-verification',
  dharmicCertification: 'https://www.zeffy.com/en-CA/ticketing/dharmic-certification-1-yr',
  featuredCandidate: 'https://www.zeffy.com/en-CA/ticketing/featured-candidate-listing-dollar100',
  ridingAnnouncement: 'https://www.zeffy.com/en-CA/ticketing/1-riding-wide-announcement',
}

export const CATEGORIES = [
  'Healthcare & Wellness',
  'Legal & Financial', 
  'Food & Restaurant',
  'Retail & Shopping',
  'Technology',
  'Education & Tutoring',
  'Trades & Construction',
  'Real Estate',
  'Arts & Culture',
  'Other'
]

export const CONNECT_CATEGORIES = [
  { icon: '🏏', label: 'Sports & Games' },
  { icon: '🎨', label: 'Arts & Culture' },
  { icon: '📚', label: 'Study Groups' },
  { icon: '👨‍👩‍👧', label: 'Family' },
  { icon: '🍛', label: 'Food & Cooking' },
  { icon: '🧘', label: 'Wellness' },
  { icon: '💼', label: 'Professional' },
  { icon: '🙏', label: 'Seva' },
  { icon: '🎉', label: 'Events' },
  { icon: '✦', label: 'Other' },
]

export const PROVINCES = [
  'Alberta','British Columbia','Manitoba','New Brunswick',
  'Newfoundland and Labrador','Nova Scotia','Ontario',
  'Prince Edward Island','Quebec','Saskatchewan',
]
