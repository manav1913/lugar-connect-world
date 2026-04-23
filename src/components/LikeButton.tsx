import './LikeButton.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabase-client'

interface Props {
  postId: number
}

interface VoteData {
  count: number
  liked: boolean
  voteRowId: number | null
}

const getLikeData = async (postId: number): Promise<VoteData> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw new Error(userError.message)

  const { count, error: countError } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)
    .eq('vote', 1)

  if (countError) throw new Error(countError.message)

  if (!user) {
    return {
      count: count || 0,
      liked: false,
      voteRowId: null,
    }
  }

  const { data: existingVotes, error: voteError } = await supabase
    .from('votes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .eq('vote', 1)
    .order('id', { ascending: false })
    .limit(1)

  if (voteError) throw new Error(voteError.message)

  const voteRow = existingVotes && existingVotes.length > 0 ? existingVotes[0] : null

  return {
    count: count || 0,
    liked: !!voteRow,
    voteRowId: voteRow ? voteRow.id : null,
  }
}

const toggleLike = async ({
  postId,
  liked,
  voteRowId,
}: {
  postId: number
  liked: boolean
  voteRowId: number | null
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw new Error(userError.message)
  if (!user) throw new Error('Please sign in first')

  if (liked) {
    if (!voteRowId) throw new Error('Vote row not found')

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', voteRowId)

    if (error) throw new Error(error.message)

    return { liked: false }
  }

  const { data, error } = await supabase
    .from('votes')
    .insert({
      post_id: postId,
      user_id: user.id,
      vote: 1,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  return { liked: true, voteRowId: data.id }
}

const LikeButton = ({ postId }: Props) => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<VoteData>({
    queryKey: ['votes', postId],
    queryFn: () => getLikeData(postId),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: toggleLike,
    onMutate: async ({ liked, voteRowId }) => {
      await queryClient.cancelQueries({ queryKey: ['votes', postId] })

      const previousData = queryClient.getQueryData<VoteData>(['votes', postId])

      queryClient.setQueryData<VoteData>(['votes', postId], (old) => {
        if (!old) {
          return {
            count: liked ? 0 : 1,
            liked: !liked,
            voteRowId: liked ? null : voteRowId,
          }
        }

        return {
          count: liked ? Math.max(0, old.count - 1) : old.count + 1,
          liked: !liked,
          voteRowId: liked ? null : old.voteRowId,
        }
      })

      return { previousData }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['votes', postId], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', postId] })
    },
  })

  const handleClick = () => {
    if (!data || isPending) return

    mutate({
      postId,
      liked: data.liked,
      voteRowId: data.voteRowId,
    })
  }

  if (isLoading) {
    return (
      <button type="button" className="like-btn">
        <span className="heart">♡</span>
        <span className="like-count">0</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`like-btn ${data?.liked ? 'liked' : ''}`}
      onClick={handleClick}
      aria-label={data?.liked ? 'Unlike post' : 'Like post'}
      disabled={isPending}
    >
      <span className="heart">{data?.liked ? '❤' : '♡'}</span>
      <span className="like-count">{data?.count}</span>
    </button>
  )
}

export default LikeButton