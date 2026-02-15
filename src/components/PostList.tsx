import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard/PostCard';
import { IPost, ITag } from '../data';
import '../App.css';
import { useAuth } from '../context/AuthContext';

export const PostList: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
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

                const headers: HeadersInit = {
                    'Content-Type': 'application/json'
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const [postsResponse, tagsResponse] = await Promise.all([
                    fetch('http://localhost:8000/posts', { headers }),
                    fetch('http://localhost:8000/tags')
                ]);

                if (!postsResponse.ok || !tagsResponse.ok) throw new Error('Failed to fetch data');

                const postsData = await postsResponse.json();
                const tagsData = await tagsResponse.json();

                setPosts(postsData);
                setTags(tagsData);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLikes = post.likeCount >= minLikes;

        const matchesTags = selectedTags.length === 0 || post.tags.some((t: any) => {
            const tagId = t.tagId || t.tag?.id || t.id;
            return selectedTags.includes(tagId);
        });

        return matchesSearch && matchesLikes && matchesTags;
    });

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
    };

    if (isLoading) return <div className="loading-state"><div className="spinner"></div></div>;
    if (error) return <div className="error-state">😕 Ой! {error}</div>;

    return (
        <div className="layout-container">

            <aside className="sidebar">
                <div className="sidebar-sticky">
                    <h2 className="sidebar-title">Фільтри</h2>

                    <div className="filter-section">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Пошук..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Лайки</h3>
                        <div className="radio-group">
                            {[0, 50, 100].map(val => (
                                <label key={val} className={`radio-label ${minLikes === val ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        checked={minLikes === val}
                                        onChange={() => setMinLikes(val)}
                                    />
                                    {val === 0 ? "Всі" : `> ${val} ❤️`}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Теги</h3>
                        <div className="tags-cloud-filter">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    className={`tag-filter-btn ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            <main className="feed">
                <div className="feed-header">
                    <h2>Публікації <span className="post-count">{filteredPosts.length}</span></h2>
                </div>

                <div className="posts-grid">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
                    ) : (
                        <div className="empty-state">
                            <p>Нічого не знайдено 🕵️‍♂️</p>
                            <button onClick={() => { setSearchTerm(''); setMinLikes(0); setSelectedTags([]) }}>
                                Очистити фільтри
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};