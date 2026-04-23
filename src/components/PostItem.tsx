import type { Post } from './PostList'
import { Link } from 'react-router'
import "./PostItem.css"

interface Props {
  post: Post
}

const PostItem = ({ post }: Props) => {
  return (
    <Link to={`/post/${post.id}`} className="post-card">

      {post.avatar_url && (
        <img
          src={post.avatar_url}
          alt=""
          className="post-avatar"
        />
      )}

      <div className="post-image">
        <img src={post.image_url} alt={post.title} />
      </div>

      <div className="post-content">
        <h3>{post.title}</h3>
      </div>

    </Link>
  )
}

export default PostItem