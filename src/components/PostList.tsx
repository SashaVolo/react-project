import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { IPost, ITag } from '../data'; 
import '../App.css';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]); 
  const [tags, setTags] = useState<ITag[]>([]);   
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [minLikes, setMinLikes] = useState(0);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [postsResponse, tagsResponse] = await Promise.all([
          fetch('http://localhost:8000/posts'),
          fetch('http://localhost:8000/tags')
        ]);

        if (!postsResponse.ok || !tagsResponse.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const postsData = await postsResponse.json();
        const tagsData = await tagsResponse.json();

        setPosts(postsData);
        setTags(tagsData);
        setError(null); 

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, []); 

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLikes = post.likeCount >= minLikes;
    
    const matchesTags =
      selectedTags.length === 0 ||
      post.tags.some(t => selectedTags.includes(t.tag.id));

    return matchesSearch && matchesLikes && matchesTags;
  });

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (isLoading) {
    return (
      <div className="post-list-container loading-container">
        <div className="spinner"></div>
        <h3>Loading data...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list-container error-container">
        <div className="error-box">
          <span className="error-icon">⚠️</span>
          <h3>Error fetching data</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
             Check if the backend server is running on port 8000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <aside className="filters-sidebar">
        <h2 className="section-heading">Filtration</h2>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search term"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-box">
            <h3>Filter by likes</h3>
            <label>
              <input 
                type="radio" 
                checked={minLikes === 0}
                onChange={() => setMinLikes(0)} 
              /> All (0+)
            </label>
            <label>
              <input 
                type="radio" 
                checked={minLikes === 50}
                onChange={() => setMinLikes(50)} 
              /> &gt; 50
            </label>
            <label>
              <input 
                type="radio" 
                checked={minLikes === 100}
                onChange={() => setMinLikes(100)} 
              /> &gt; 100
            </label>
          </div>

          <div className="filter-box">
            <h3>Tag selection</h3>
            {tags.length > 0 ? tags.map(tag => (
              <label key={tag.id}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                /> {tag.name}
              </label>
            )) : <p>No tags available</p>}
          </div>
        </div>
      </aside>

      <section className="posts-feed">
        <h2 className="section-heading">Posts ({filteredPosts.length})</h2>

        <div className="posts-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
               const shortPost = {
                ...post,
                description: post.description.length > 200
                  ? post.description.slice(0, 100) + '...'
                  : post.description
              };
              return <PostCard key={post.id} post={shortPost} />;
            })
          ) : (
            <p>No posts found matching your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
};