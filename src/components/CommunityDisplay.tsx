import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'

interface Props {
  communityId: number
}

interface Community {
  id: number
  name: string
  description: string
}

const fetchCommunityById = async (id: number): Promise<Community> => {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Community
}

const CommunityDisplay = ({ communityId }: Props) => {
  const { data, isLoading, error } = useQuery<Community, Error>({
    queryKey: ['community', communityId],
    queryFn: () => fetchCommunityById(communityId),
    enabled: !!communityId,
  })

  if (isLoading) return <p>Loading community...</p>

  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="community-display">
      <h2>{data?.name} Community</h2>
      <p>{data?.description}</p>
    </div>
  )
}

export default CommunityDisplay
