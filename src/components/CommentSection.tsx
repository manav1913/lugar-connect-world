import React, { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import './CommentSection.css'

interface Props {
    postId: number
}

interface Comment {
    id: number
    post_id: number
    content: string
    parent_comment_id: number | null
    user_id: string
    author: string
    created_at: string
}

interface CommentNode extends Comment {
    children: CommentNode[]
}

interface NewComment {
    content: string
    parent_comment_id?: number | null
}

const createComment = async (
    newComment: NewComment,
    postId: number,
    userId?: string,
    author?: string
) => {
    if (!userId || !author) {
        throw new Error('You must be logged in to comment')
    }

    const { error } = await supabase.from('comments').insert({
        post_id: postId,
        content: newComment.content,
        parent_comment_id: newComment.parent_comment_id ?? null,
        user_id: userId,
        author,
    })

    if (error) throw new Error(error.message)
}

const fetchComments = async (postId: number): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data as Comment[]
}

const buildCommentTree = (comments: Comment[]): CommentNode[] => {
    const map = new Map<number, CommentNode>()
    const roots: CommentNode[] = []

    comments.forEach((comment) => {
        map.set(comment.id, { ...comment, children: [] })
    })

    comments.forEach((comment) => {
        const node = map.get(comment.id)
        if (!node) return

        if (comment.parent_comment_id) {
            const parent = map.get(comment.parent_comment_id)
            if (parent) {
                parent.children.push(node)
            } else {
                roots.push(node)
            }
        } else {
            roots.push(node)
        }
    })

    return roots
}

interface CommentItemProps {
    comment: CommentNode
    postId: number
    currentUserId?: string
    currentAuthor?: string
}

const CommentItem = ({
    comment,
    postId,
    currentUserId,
    currentAuthor,
}: CommentItemProps) => {
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [showReplies, setShowReplies] = useState(true)

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (newComment: NewComment) =>
            createComment(newComment, postId, currentUserId, currentAuthor),
        onSuccess: () => {
            setReplyText('')
            setShowReplyBox(false)
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        },
    })

    const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const trimmedReply = replyText.trim()
        if (!trimmedReply) return

        mutate({
            content: trimmedReply,
            parent_comment_id: comment.id,
        })
    }

    return (
        <div className="thread-comment">
            <div className="thread-comment-body">
                <div className="thread-comment-meta">
                    <span className="thread-comment-author">{comment.author}</span>
                    <span className="thread-comment-date">
                        {new Date(comment.created_at).toDateString()}
                    </span>
                </div>

                <p className="thread-comment-text">{comment.content}</p>

                <div className="thread-actions">
                    {currentUserId && (
                        <button
                            type="button"
                            className="thread-reply-btn"
                            onClick={() => setShowReplyBox((prev) => !prev)}
                        >
                            {showReplyBox ? 'Cancel' : 'Reply'}
                        </button>
                    )}

                    {comment.children.length > 0 && (
                        <button
                            type="button"
                            className="thread-toggle-btn"
                            onClick={() => setShowReplies((prev) => !prev)}
                        >
                            {showReplies
                                ? 'Hide replies'
                                : `Show replies (${comment.children.length})`}
                        </button>
                    )}
                </div>

                {showReplyBox && (
                    <form className="thread-reply-form" onSubmit={handleReplySubmit}>
                        <textarea
                            className="thread-reply-textarea"
                            rows={3}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="thread-reply-submit"
                            disabled={!replyText.trim() || isPending}
                        >
                            {isPending ? 'Posting...' : 'Post Reply'}
                        </button>
                    </form>
                )}
            </div>

            {showReplies && comment.children.length > 0 && (
                <div className="thread-children">
                    {comment.children.map((child) => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            postId={postId}
                            currentUserId={currentUserId}
                            currentAuthor={currentAuthor}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const CommentSection = ({ postId }: Props) => {
    const [newCommentText, setNewCommentText] = useState('')
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const {
        data: comments = [],
        isLoading,
        isError: isCommentsError,
        error: commentsError,
    } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => fetchComments(postId),
    })

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: (newComment: NewComment) =>
            createComment(
                newComment,
                postId,
                user?.id,
                user?.user_metadata?.user_name || user?.email
            ),
        onSuccess: () => {
            setNewCommentText('')
            queryClient.invalidateQueries({ queryKey: ['comments', postId] })
        },
    })

    const commentTree = useMemo(() => buildCommentTree(comments), [comments])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const trimmedComment = newCommentText.trim()
        if (!trimmedComment) return

        mutate({
            content: trimmedComment,
            parent_comment_id: null,
        })
    }

    return (
        <div className="comment-section">
            <h3 className="comment-title">Comments</h3>

            {user ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <textarea
                        className="comment-textarea"
                        value={newCommentText}
                        rows={3}
                        placeholder="Write a comment..."
                        onChange={(e) => setNewCommentText(e.target.value)}
                    />

                    <button
                        className="comment-submit-btn"
                        type="submit"
                        disabled={!newCommentText.trim() || isPending}
                    >
                        {isPending ? 'Posting...' : 'Post Comment'}
                    </button>

                    {isError && (
                        <p className="comment-error">
                            {error instanceof Error ? error.message : 'Error posting comment.'}
                        </p>
                    )}
                </form>
            ) : (
                <p className="comment-login-text">
                    You must be logged in to post a comment.
                </p>
            )}

            <div className="thread-list">
                {isLoading && <p className="comment-login-text">Loading comments...</p>}

                {isCommentsError && (
                    <p className="comment-error">
                        {commentsError instanceof Error
                            ? commentsError.message
                            : 'Error loading comments.'}
                    </p>
                )}

                {!isLoading && !isCommentsError && commentTree.length === 0 && (
                    <p className="comment-login-text">No comments yet.</p>
                )}

                {commentTree.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={postId}
                        currentUserId={user?.id}
                        currentAuthor={user?.user_metadata?.user_name || user?.email}
                    />
                ))}
            </div>
        </div>
    )
}

export default CommentSection