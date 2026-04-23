import React from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import type { Post } from './PostList'
import "./PostDetail.css"

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

    const { data, error, isLoading } = useQuery<Post, Error>({
        queryKey: ['post', postId],
        queryFn: () => fetchPostById(postId),
        enabled: !!postId, // prevents running when id is undefined
    })

    if (isLoading) return <div>Loading post...</div>

    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="post-detail">
            <div className="post-detail-container">
                <h1 className="post-title">{data?.title}</h1>

                {data && (
                    <p className="post-date">
                        Posted on {new Date(data.created_at).toDateString()}
                    </p>
                )}

                <div className="post-image-wrapper">
                    <img src={data?.image_url} alt={data?.title} />
                </div>

                <p className="post-content">{data?.content}</p>
            </div>
        </div>
    )
}

export default PostDetail