import {createClient} from "@supabase/supabase-js"

const supabaseURL = "https://ibtqcvgrkecggvbekstq.supabase.co"
const supabaseAnnonKey = import.meta.env.VITE_SUPABASE_ANNON_KEY as string


export const supabase = createClient(supabaseURL, supabaseAnnonKey)
