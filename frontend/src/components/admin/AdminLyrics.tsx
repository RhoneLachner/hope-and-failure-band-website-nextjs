'use client';

import React, { useState } from 'react';
import { useLyrics } from '../../context/LyricsContext';
import type { Song } from '../../context/LyricsContext';
import AdminMessage from './AdminMessage';

interface AdminLyricsProps {
    setMessage: (message: string) => void;
    message: string;
    loading: boolean;
}

const AdminLyrics: React.FC<AdminLyricsProps> = ({
    setMessage,
    message,
    loading,
}) => {
    const { lyrics, addSong, updateSong, deleteSong, fetchLyrics } =
        useLyrics();

    // Lyrics state
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [newSong, setNewSong] = useState<Omit<Song, 'id'>>({
        title: '',
        lyrics: '',
        order: 1,
        isInstrumental: false,
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
                Lyrics Management
            </h2>

            <AdminMessage message={message} />

            {/* Add New Song Form */}
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
                    {editingSong ? 'Edit Song' : 'Add New Song'}
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Song Title *"
                        value={editingSong ? editingSong.title : newSong.title}
                        onChange={(e) =>
                            editingSong
                                ? setEditingSong({
                                      ...editingSong,
                                      title: e.target.value,
                                  })
                                : setNewSong({
                                      ...newSong,
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
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="number"
                            placeholder="Display Order"
                            min="1"
                            value={
                                editingSong ? editingSong.order : newSong.order
                            }
                            onChange={(e) =>
                                editingSong
                                    ? setEditingSong({
                                          ...editingSong,
                                          order: parseInt(e.target.value) || 1,
                                      })
                                    : setNewSong({
                                          ...newSong,
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
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={
                                    editingSong
                                        ? editingSong.isInstrumental
                                        : newSong.isInstrumental
                                }
                                onChange={(e) =>
                                    editingSong
                                        ? setEditingSong({
                                              ...editingSong,
                                              isInstrumental: e.target.checked,
                                          })
                                        : setNewSong({
                                              ...newSong,
                                              isInstrumental: e.target.checked,
                                          })
                                }
                                style={{
                                    transform: 'scale(1.2)',
                                }}
                            />
                            <label
                                style={{
                                    color: '#fff',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Instrumental
                            </label>
                        </div>
                    </div>

                    <textarea
                        placeholder="Lyrics (leave empty for instrumentals)"
                        value={
                            editingSong ? editingSong.lyrics : newSong.lyrics
                        }
                        onChange={(e) =>
                            editingSong
                                ? setEditingSong({
                                      ...editingSong,
                                      lyrics: e.target.value,
                                  })
                                : setNewSong({
                                      ...newSong,
                                      lyrics: e.target.value,
                                  })
                        }
                        rows={8}
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '1rem',
                            resize: 'vertical',
                            fontFamily: 'monospace',
                            lineHeight: '1.5',
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
                                const songData = editingSong || newSong;
                                if (!songData.title) {
                                    setMessage(
                                        '❌ Please fill in the song title'
                                    );
                                    return;
                                }

                                const success = editingSong
                                    ? await updateSong(editingSong.id, songData)
                                    : await addSong(songData);

                                if (success) {
                                    setMessage(
                                        editingSong
                                            ? '✅ Song updated successfully'
                                            : '✅ Song added successfully'
                                    );
                                    setEditingSong(null);
                                    setNewSong({
                                        title: '',
                                        lyrics: '',
                                        order: lyrics.length + 1,
                                        isInstrumental: false,
                                    });
                                    await fetchLyrics();
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
                            {editingSong ? 'Update Song' : 'Add Song'}
                        </button>

                        {editingSong && (
                            <button
                                onClick={() => {
                                    setEditingSong(null);
                                    setNewSong({
                                        title: '',
                                        lyrics: '',
                                        order: lyrics.length + 1,
                                        isInstrumental: false,
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

            {/* Songs List */}
            <div>
                <h3
                    style={{
                        marginBottom: '1.5rem',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                    }}
                >
                    Existing Songs ({lyrics.length})
                </h3>

                {lyrics.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '2rem',
                            opacity: 0.6,
                            fontStyle: 'italic',
                        }}
                    >
                        No songs found. Add your first song above.
                    </div>
                ) : (
                    lyrics.map((song) => (
                        <div
                            key={song.id}
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
                                        {song.title}
                                        {song.isInstrumental && (
                                            <span
                                                style={{
                                                    fontSize: '0.8rem',
                                                    color: '#999',
                                                    marginLeft: '0.5rem',
                                                    fontStyle: 'italic',
                                                }}
                                            >
                                                (instrumental)
                                            </span>
                                        )}
                                    </h4>
                                    <p
                                        style={{
                                            margin: '0.25rem 0',
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        📊 Order: {song.order}
                                    </p>
                                    {song.lyrics && (
                                        <div
                                            style={{
                                                marginTop: '1rem',
                                                padding: '1rem',
                                                background:
                                                    'rgba(255, 255, 255, 0.05)',
                                                borderRadius: '4px',
                                                maxHeight: '200px',
                                                overflow: 'auto',
                                            }}
                                        >
                                            <p
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                    fontSize: '0.85rem',
                                                    lineHeight: '1.4',
                                                    opacity: 0.9,
                                                    fontFamily: 'monospace',
                                                }}
                                            >
                                                {song.lyrics}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <button
                                        onClick={() => setEditingSong(song)}
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
                                                    `Are you sure you want to delete "${song.title}"?`
                                                )
                                            ) {
                                                const success =
                                                    await deleteSong(song.id);
                                                if (success) {
                                                    setMessage(
                                                        '✅ Song deleted successfully'
                                                    );
                                                    await fetchLyrics();
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

export default AdminLyrics;
