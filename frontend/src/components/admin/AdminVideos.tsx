'use client';

import React, { useState } from 'react';
import { useVideos } from '../../context/VideosContext';
import type { Video } from '../../context/VideosContext';
import AdminMessage from './AdminMessage';

interface AdminVideosProps {
    setMessage: (message: string) => void;
    message: string;
    loading: boolean;
}

const AdminVideos: React.FC<AdminVideosProps> = ({
    setMessage,
    message,
    loading,
}) => {
    const { videos, addVideo, updateVideo, deleteVideo, fetchVideos } =
        useVideos();

    // Videos state
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);
    const [newVideo, setNewVideo] = useState<Omit<Video, 'id'>>({
        youtubeId: '',
        title: '',
        description: '',
        order: 1,
    });

    return (
        <div>
            <h2
                style={{
                    marginBottom: '2rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                Video Management
            </h2>

            <AdminMessage message={message} />

            {/* Add New Video Form */}
            <div
                style={{
                    background: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginBottom: '2rem',
                }}
            >
                <h3
                    style={{
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                    }}
                >
                    {editingVideo ? 'Edit Video' : 'Add New Video'}
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="YouTube Video ID * (e.g., dQw4w9WgXcQ)"
                        value={
                            editingVideo
                                ? editingVideo.youtubeId
                                : newVideo.youtubeId
                        }
                        onChange={(e) =>
                            editingVideo
                                ? setEditingVideo({
                                      ...editingVideo,
                                      youtubeId: e.target.value,
                                  })
                                : setNewVideo({
                                      ...newVideo,
                                      youtubeId: e.target.value,
                                  })
                        }
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Video Title *"
                        value={
                            editingVideo ? editingVideo.title : newVideo.title
                        }
                        onChange={(e) =>
                            editingVideo
                                ? setEditingVideo({
                                      ...editingVideo,
                                      title: e.target.value,
                                  })
                                : setNewVideo({
                                      ...newVideo,
                                      title: e.target.value,
                                  })
                        }
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                        }}
                    />

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                        }}
                    >
                        <input
                            type="number"
                            placeholder="Display Order"
                            min="1"
                            value={
                                editingVideo
                                    ? editingVideo.order
                                    : newVideo.order
                            }
                            onChange={(e) =>
                                editingVideo
                                    ? setEditingVideo({
                                          ...editingVideo,
                                          order: parseInt(e.target.value) || 1,
                                      })
                                    : setNewVideo({
                                          ...newVideo,
                                          order: parseInt(e.target.value) || 1,
                                      })
                            }
                            style={{
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <textarea
                        placeholder="Description (optional)"
                        value={
                            editingVideo
                                ? editingVideo.description || ''
                                : newVideo.description
                        }
                        onChange={(e) =>
                            editingVideo
                                ? setEditingVideo({
                                      ...editingVideo,
                                      description: e.target.value,
                                  })
                                : setNewVideo({
                                      ...newVideo,
                                      description: e.target.value,
                                  })
                        }
                        rows={3}
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                            resize: 'vertical',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            onClick={async () => {
                                const videoData = editingVideo || newVideo;
                                if (!videoData.youtubeId || !videoData.title) {
                                    setMessage(
                                        '❌ Please fill in required fields (YouTube ID, title)'
                                    );
                                    return;
                                }

                                const success = editingVideo
                                    ? await updateVideo(
                                          editingVideo.id,
                                          videoData
                                      )
                                    : await addVideo(videoData);

                                if (success) {
                                    setMessage(
                                        editingVideo
                                            ? '✅ Video updated successfully'
                                            : '✅ Video added successfully'
                                    );
                                    setEditingVideo(null);
                                    setNewVideo({
                                        youtubeId: '',
                                        title: '',
                                        description: '',
                                        order: videos.length + 1,
                                    });
                                    await fetchVideos();
                                }
                            }}
                            disabled={loading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'none',
                                border: '1px solid #4CAF50',
                                borderRadius: '4px',
                                color: '#4CAF50',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.5 : 1,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {editingVideo ? 'Update Video' : 'Add Video'}
                        </button>

                        {editingVideo && (
                            <button
                                onClick={() => {
                                    setEditingVideo(null);
                                    setNewVideo({
                                        youtubeId: '',
                                        title: '',
                                        description: '',
                                        order: videos.length + 1,
                                    });
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'none',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Videos List */}
            <div>
                <h3
                    style={{
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                    }}
                >
                    Existing Videos ({videos.length})
                </h3>

                {videos.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '2rem',
                            opacity: 0.6,
                            fontStyle: 'italic',
                        }}
                    >
                        No videos found. Add your first video above.
                    </div>
                ) : (
                    videos.map((video) => (
                        <div
                            key={video.id}
                            style={{
                                background: 'rgba(20, 20, 20, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                marginBottom: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h4
                                        style={{
                                            fontSize: '1.1rem',
                                            marginBottom: '0.5rem',
                                            color: '#fff',
                                        }}
                                    >
                                        {video.title}
                                    </h4>
                                    <p
                                        style={{
                                            margin: '0.25rem 0',
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        🎬 YouTube ID: {video.youtubeId}
                                    </p>
                                    <p
                                        style={{
                                            margin: '0.25rem 0',
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        📊 Order: {video.order}
                                    </p>
                                    {video.description && (
                                        <p
                                            style={{
                                                margin: '0.5rem 0 0 0',
                                                opacity: 0.7,
                                                fontSize: '0.85rem',
                                                lineHeight: '1.4',
                                            }}
                                        >
                                            {video.description}
                                        </p>
                                    )}
                                    <p
                                        style={{
                                            margin: '0.5rem 0',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        🔗{' '}
                                        <a
                                            href={`https://youtube.com/watch?v=${video.youtubeId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#4CAF50',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            View on YouTube
                                        </a>
                                    </p>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <button
                                        onClick={() => setEditingVideo(video)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'none',
                                            border: '1px solid #2196F3',
                                            borderRadius: '4px',
                                            color: '#2196F3',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (
                                                confirm(
                                                    `Are you sure you want to delete "${video.title}"?`
                                                )
                                            ) {
                                                const success =
                                                    await deleteVideo(video.id);
                                                if (success) {
                                                    setMessage(
                                                        '✅ Video deleted successfully'
                                                    );
                                                    await fetchVideos();
                                                }
                                            }
                                        }}
                                        disabled={loading}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'none',
                                            border: '1px solid #f44336',
                                            borderRadius: '4px',
                                            color: '#f44336',
                                            fontSize: '0.8rem',
                                            cursor: loading
                                                ? 'not-allowed'
                                                : 'pointer',
                                            opacity: loading ? 0.5 : 1,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminVideos;
