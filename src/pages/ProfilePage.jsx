import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getPublicProfile, updateProfile, toggleFollow } from '../services/auth';
import { getUserBlogs } from '../services/blog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import SkeletonCard from '../components/SkeletonCard';
import { getImageUrl } from '../utils/helpers';

const ProfilePage = () => {
    const { id: userId } = useParams();
    const { user: currentUser, setUser: setCurrentUserInContext } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('stories'); // 'stories' or 'settings'
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Settings form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        github: '',
        facebook: '',
        linkedin: '',
        avatar: null
    });
    const [updating, setUpdating] = useState(false);

    const isMe = !userId || (currentUser && currentUser.id === parseInt(userId));

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let userData;
                if (isMe) {
                    userData = await getProfile();
                } else {
                    userData = await getPublicProfile(userId);
                }
                setProfileUser(userData);
                setIsFollowing(userData.is_following);
                
                if (isMe) {
                    setFormData({
                        first_name: userData.first_name || '',
                        last_name: userData.last_name || '',
                        bio: userData.profile?.bio || '',
                        github: userData.profile?.github || '',
                        facebook: userData.profile?.facebook || '',
                        linkedin: userData.profile?.linkedin || '',
                        avatar: null
                    });
                }

                // Fetch blogs
                setBlogsLoading(true);
                const blogsData = await getUserBlogs(userData.id);
                setBlogs(blogsData.results || blogsData);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
                setBlogsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId, isMe]);

    const handleFollow = async () => {
        if (!currentUser) return;
        try {
            const res = await toggleFollow(profileUser.id);
            setIsFollowing(res.is_following);
            setProfileUser(prev => ({
                ...prev,
                followers_count: res.is_following ? prev.followers_count + 1 : prev.followers_count - 1
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const data = new FormData();
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('profile.bio', formData.bio);
            data.append('profile.github', formData.github);
            data.append('profile.facebook', formData.facebook);
            data.append('profile.linkedin', formData.linkedin);
            if (formData.avatar) {
                data.append('profile.avatar', formData.avatar);
            }

            const updatedUser = await updateProfile(data);
            setProfileUser(updatedUser);
            setCurrentUserInContext(updatedUser);
            setActiveTab('stories');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow max-w-[1000px] mx-auto w-full px-6 py-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 border-b border-slate-100 pb-12 animate-pulse">
                    <div className="size-32 md:size-40 rounded-full bg-slate-50 border border-slate-100 flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col items-center md:items-start gap-4">
                        <div className="h-10 bg-slate-100 rounded-lg w-64 mb-2"></div>
                        <div className="h-4 bg-slate-50 rounded w-full max-w-xl mb-4"></div>
                        <div className="flex gap-8 mt-2">
                            <div className="h-12 bg-slate-50 rounded w-16"></div>
                            <div className="h-12 bg-slate-50 rounded w-16"></div>
                            <div className="h-12 bg-slate-50 rounded w-16"></div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
                    <div className="pb-4 w-16 h-4 bg-slate-50 rounded"></div>
                    <div className="pb-4 w-16 h-4 bg-slate-50 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            
            <main className="flex-grow max-w-[1000px] mx-auto w-full px-6 py-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 border-b border-slate-100 pb-12">
                    <div className="size-32 md:size-40 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary text-4xl font-black overflow-hidden shadow-inner">
                        {profileUser.profile?.avatar ? (
                            <img className="w-full h-full object-cover" src={getImageUrl(profileUser.profile.avatar)} alt={profileUser.username} />
                        ) : (
                           profileUser.username[0].toUpperCase()
                        )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-3xl font-black tracking-tight">{profileUser.first_name} {profileUser.last_name || `@${profileUser.username}`}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                {isMe ? (
                                    <button 
                                        onClick={() => setActiveTab('settings')}
                                        className="text-sm font-bold px-6 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleFollow}
                                        className={`text-sm font-bold px-8 py-2 rounded-full transition-all ${isFollowing ? 'bg-slate-100 text-slate-600' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-slate-500 mb-6 max-w-xl mx-auto md:mx-0 leading-relaxed italic">
                            {profileUser.profile?.bio || "No bio yet."}
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-8 text-sm">
                            <div className="flex flex-col">
                                <span className="font-black text-lg">{blogs.length}</span>
                                <span className="text-slate-400 font-medium">Stories</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-lg">{profileUser.followers_count}</span>
                                <span className="text-slate-400 font-medium">Followers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-lg">{profileUser.following_count}</span>
                                <span className="text-slate-400 font-medium">Following</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('stories')}
                        className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'stories' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Stories
                    </button>
                    {isMe && (
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Settings
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                {activeTab === 'stories' ? (
                    <div className="space-y-12">
                        {blogsLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <SkeletonCard /><SkeletonCard />
                            </div>
                        ) : blogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">auto_stories</span>
                                <h3 className="text-lg font-bold text-slate-600">No stories published yet</h3>
                                {isMe && (
                                    <Link to="/write" className="text-primary font-bold mt-2 inline-block hover:underline">Start writing</Link>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">First Name</label>
                                    <input 
                                        type="text" value={formData.first_name} 
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Last Name</label>
                                    <input 
                                        type="text" value={formData.last_name} 
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Bio</label>
                                <textarea 
                                    value={formData.bio} 
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[100px] resize-none"
                                    placeholder="Write a short bio about yourself..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Profile Photo</label>
                                <input 
                                    type="file" accept="image/*"
                                    onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90 transition-all"
                                />
                            </div>

                            <button 
                                type="submit" disabled={updating}
                                className="bg-primary text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all disabled:opacity-50"
                            >
                                {updating ? 'Saving Changes...' : 'Save Settings'}
                            </button>
                        </form>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
