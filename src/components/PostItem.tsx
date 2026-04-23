import React from 'react'
import type { Post } from './PostList'
import { Link } from 'react-router'
import "./PostItem.css"

interface Props{
    post:Post
}

const PostItem = ({post}:Props) => {
  return (
    <div>
      <Link to={`/post/${post.id}`} className='post-card'>
        <div className="post-image">
        <img src={post.image_url} alt={post.title} />
      </div>

      <div className="post-content">
        <h3>{post.title}</h3>
      </div>
      </Link>
    </div>
  )
}

export default PostItem
