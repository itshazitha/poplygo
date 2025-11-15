export interface Session {
  id: string
  code: string
  title: string
  created_by?: string
  auth_required: boolean
  active: boolean
  created_at: string
}

export interface Question {
  id: string
  session_id: string
  content: string
  upvotes: number
  author_name?: string
  created_at: string
}

export interface Poll {
  id: string
  session_id: string
  question: string
  options: string[]
  responses: any[]
  active: boolean
  created_at: string
}
