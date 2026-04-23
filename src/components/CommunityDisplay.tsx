import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import PostItem from './PostItem'
import './CommunityDisplay.css'
import type { Post } from './PostList'
import { Link } from 'react-router'

interface Props {
  communityId: number
}

interface Community {
  id: number
  name: string
  description: string
  created_at: string
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

const fetchPostsByCommunity = async (id: number): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('community_id', id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Post[]
}

const CommunityDisplay = ({ communityId }: Props) => {
  const {
    data: community,
    isLoading: communityLoading,
    error: communityError,
  } = useQuery<Community, Error>({
    queryKey: ['community', communityId],
    queryFn: () => fetchCommunityById(communityId),
    enabled: !!communityId,
  })

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery<Post[], Error>({
    queryKey: ['community-posts', communityId],
    queryFn: () => fetchPostsByCommunity(communityId),
    enabled: !!communityId,
  })

  if (communityLoading) return <p>Loading community...</p>
  if (communityError) return <p>Error: {communityError.message}</p>

  return (
    <div className="community-layout">
      <aside className="community-left">
        <div className="sidebar-card">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/communities">All Communities</Link></li>
            <li><Link to="/create">Create Post</Link></li>
          </ul>
        </div>

        <div className="sidebar-card">
          <h3>About</h3>
          <p>Join discussions, share posts, and explore communities.</p>
        </div>
      </aside>

      <main className="community-center">
        <div className="community-header">
          <h2>{community?.name}</h2>
          <p>{community?.description}</p>
        </div>

        <div className="community-posts">
          {postsLoading && <p>Loading posts...</p>}
          {postsError && <p>Error: {postsError.message}</p>}
          {!postsLoading && posts && posts.length === 0 && (
            <p>No posts in this community yet.</p>
          )}

          {posts?.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </main>

      <aside className="community-right">
        <div className="sidebar-card">
          <h3>Community Info</h3>
          <p>{community?.description}</p>
          <span className="community-created">
            Created {community && new Date(community.created_at).toDateString()}
          </span>
        </div>

        <div className="sidebar-card">
          <h3>Quick Actions</h3>
          <Link to="/create" className="sidebar-btn">
            Create Post
          </Link>
        </div>

        <div className="sidebar-card">
          <h3>Rules</h3>
          <ul>
            <li>Be respectful</li>
            <li>No spam</li>
            <li>Keep posts relevant</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default CommunityDisplay