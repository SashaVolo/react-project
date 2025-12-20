import React from 'react';
import { IPost } from '../data'; 
import '../App.css';

interface PostCardProps {
  post: IPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="post-card">

      <h3 className="post-title">{post.name}</h3>


      <div className="post-image-wrapper">

        {post.pic ? (
             <img src={post.pic} alt={post.name} className="post-image" />
        ) : (
  
            <div style={{width: '100%', height: '100%', background: '#eee'}}></div>
        )}
      </div>


      <p className="post-description">{post.description}</p>


      <div className="post-footer">
        
        <div className="likes-info">
            🤍 {post.likeCount}
        </div>

        <div className="post-tags">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tagItem, index) => (
              <span key={index} className="tag-badge">

                {(tagItem as any).tag?.name || (tagItem as any).name || 'tag'}
              </span>
            ))
          ) : (
            <span>No tags</span>
          )}
        </div>

        <div className="author-info">
            <span className="author-name">
                {post.user?.firstName || 'Unknown'}
            </span>
            {post.user?.avatar && (
                <img src={post.user.avatar} alt="Avatar" className="author-avatar" />
            )}
        </div>

      </div>
    </article>
  );
};