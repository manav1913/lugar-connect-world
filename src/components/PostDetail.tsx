import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import type { Post } from './PostList'
import './PostDetail.css'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Post
}

const PostDetail = () => {
  const { id } = useParams()
  const postId = Number(id)

  if (!postId) {
    return <div>Invalid post</div>
  }

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  })

  if (isLoading) return <div>Loading post...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="post-detail">

      <div className="post-hero">
        <img src={data?.image_url} alt={data?.title} />

        <div className="post-hero-overlay">
          <h1 className="post-hero-title">{data?.title}</h1>

          {data && (
            <p className="post-hero-date">
              {new Date(data.created_at).toDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="post-body">
        <div className="post-body-container">

          <div className="post-actions">
            <LikeButton postId={postId} />
          </div>

          

          <p className="post-content">{data?.content}</p>
          <CommentSection postId={postId}/>

        </div>
      </div>

    </div>
  )
}

export default PostDetail