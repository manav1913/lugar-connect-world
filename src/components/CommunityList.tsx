import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { supabase } from '../supabase-client'
import './CommunityList.css'
import { Link } from 'react-router'

export interface Community {
  id: number
  name: string
  description: string
  created_at: string
}

const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Community[]
}

const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ['communities'],
    queryFn: fetchCommunities,
  })

  if (isLoading) return <p className="community-status">Loading...</p>

  if (error) return <p className="community-status">Error: {error.message}</p>

  if (!data || data.length === 0) {
    return <p className="community-status">No communities yet.</p>
  }

  return (
    <div className="community-list">
      {data.map((community) => (
        <Link
          to={`/community/${community.id}`}
          key={community.id}
          className="community-card"
        >
          <h3>{community.name}</h3>
          <p>{community.description}</p>
          <span className="community-date">
            {new Date(community.created_at).toDateString()}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default CommunityList