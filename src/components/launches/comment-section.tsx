'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@src/lib/db/supabase';
import { useUser } from '@src/hooks/use-user';
import { toast } from 'sonner';
import { MessageSquare, Reply, Loader2, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  launchId: string;
}

export function CommentSection({ launchId }: CommentSectionProps) {
  const { user, profile, isAuthenticated } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [launchId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          parent_id,
          user:users(id, full_name, avatar_url)
        `)
        .eq('launch_id', launchId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const topLevelComments = data || [];

      // Single batch query for all replies instead of N+1 individual queries
      let allReplies: any[] = [];
      if (topLevelComments.length > 0) {
        const commentIds = topLevelComments.map((c: any) => c.id);
        const { data: repliesData } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            created_at,
            parent_id,
            user:users(id, full_name, avatar_url)
          `)
          .in('parent_id', commentIds)
          .order('created_at', { ascending: true });
        allReplies = repliesData || [];
      }

      const commentsWithReplies = topLevelComments.map((comment: any) => ({
        ...comment,
        replies: allReplies.filter((r) => r.parent_id === comment.id),
      }));

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    const commentContent = newComment.trim();
    
    // Optimistic update - add comment to UI immediately
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content: commentContent,
      created_at: new Date().toISOString(),
      user: {
        id: user?.id || '',
        full_name: profile?.full_name || 'You',
        avatar_url: profile?.avatar_url || null,
      },
      replies: [],
    };
    
    setComments([optimisticComment, ...comments]);
    setNewComment('');
    toast.success('Comment posted!');

    // Perform DB operation in background
    supabase.from('comments').insert({
      launch_id: launchId,
      user_id: user?.id,
      content: commentContent,
    }).select().then(({ error }) => {
      if (error) {
        console.error('Comment error:', error);
        toast.error('Failed to post comment - please try again');
        // Revert optimistic update
        setComments(comments.filter(c => c.id !== optimisticComment.id));
      } else {
        // Refresh to get real comment with proper ID
        fetchComments();
      }
    });
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to reply');
      return;
    }

    if (!replyContent.trim()) return;

    const replyText = replyContent.trim();
    
    // Optimistic update - add reply to UI immediately
    const optimisticReply: Comment = {
      id: `temp-${Date.now()}`,
      content: replyText,
      created_at: new Date().toISOString(),
      user: {
        id: user?.id || '',
        full_name: profile?.full_name || 'You',
        avatar_url: profile?.avatar_url || null,
      },
    };
    
    setComments(comments.map(c => 
      c.id === parentId 
        ? { ...c, replies: [...(c.replies || []), optimisticReply] }
        : c
    ));
    setReplyContent('');
    setReplyingTo(null);
    toast.success('Reply posted!');

    // Perform DB operation in background
    supabase.from('comments').insert({
      launch_id: launchId,
      user_id: user?.id,
      content: replyText,
      parent_id: parentId,
    }).select().then(({ error }) => {
      if (error) {
        console.error('Reply error:', error);
        toast.error('Failed to post reply - please try again');
        // Refresh comments to remove failed optimistic update
        fetchComments();
      } else {
        // Refresh to get real reply with proper ID
        fetchComments();
      }
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-3 ${isReply ? 'ml-12 mt-3' : ''}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user.avatar_url || ''} />
        <AvatarFallback>
          {comment.user.full_name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user.full_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        {!isReply && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-7 text-xs"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        )}

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-2 flex gap-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                onClick={() => handleSubmitReply(comment.id)}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Discussion ({comments.length})
      </h3>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || ''} />
          <AvatarFallback>
            {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder={isAuthenticated ? "What do you think about this launch?" : "Please login to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated}
            className="min-h-[80px]"
          />
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || !isAuthenticated}
            className="self-end"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
