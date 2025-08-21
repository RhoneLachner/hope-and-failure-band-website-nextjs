import React from 'react';
import { useBio } from '../../context/BioContext';
import AdminMessage from './AdminMessage';

interface AdminBioProps {
    setMessage: (message: string) => void;
    message: string;
    loading: boolean;
}

const AdminBio: React.FC<AdminBioProps> = ({
    setMessage,
    message,
    loading,
}) => {
    const { bio, updateBio } = useBio();

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
                Bio Management
            </h2>

            <AdminMessage message={message} />

            {bio ? (
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
                        Edit Band Bio
                    </h3>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Main Text Paragraphs */}
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    opacity: 0.8,
                                }}
                            >
                                Main Bio Text (Each paragraph)
                            </label>
                            {bio.mainText.map((paragraph, index) => (
                                <textarea
                                    key={index}
                                    placeholder={`Paragraph ${index + 1}`}
                                    value={paragraph}
                                    onChange={(e) => {
                                        const newMainText = [...bio.mainText];
                                        newMainText[index] = e.target.value;
                                        // Update bio with new mainText
                                        updateBio({
                                            mainText: newMainText,
                                        });
                                    }}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '4px',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                        marginBottom: '1rem',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            ))}

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginTop: '0.5rem',
                                }}
                            >
                                <button
                                    onClick={() => {
                                        const newMainText = [
                                            ...bio.mainText,
                                            '',
                                        ];
                                        updateBio({
                                            mainText: newMainText,
                                        });
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'none',
                                        border: '1px solid #4CAF50',
                                        borderRadius: '4px',
                                        color: '#4CAF50',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    + Add Paragraph
                                </button>
                                {bio.mainText.length > 1 && (
                                    <button
                                        onClick={() => {
                                            const newMainText =
                                                bio.mainText.slice(0, -1);
                                            updateBio({
                                                mainText: newMainText,
                                            });
                                        }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'none',
                                            border: '1px solid #f44336',
                                            borderRadius: '4px',
                                            color: '#f44336',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        - Remove Last
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Band Image */}
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    opacity: 0.8,
                                }}
                            >
                                Band Image Path
                            </label>
                            <input
                                type="text"
                                placeholder="/assets/images/HopeFailure-BandPic.jpg"
                                value={bio.bandImage}
                                onChange={(e) =>
                                    updateBio({
                                        bandImage: e.target.value,
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    fontSize: '1rem',
                                }}
                            />
                        </div>

                        {/* Past Members */}
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    opacity: 0.8,
                                }}
                            >
                                Past Members
                            </label>
                            {bio.pastMembers.map((member, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder={`Past member ${index + 1}`}
                                        value={member}
                                        onChange={(e) => {
                                            const newPastMembers = [
                                                ...bio.pastMembers,
                                            ];
                                            newPastMembers[index] =
                                                e.target.value;
                                            updateBio({
                                                pastMembers: newPastMembers,
                                            });
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background:
                                                'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '4px',
                                            color: '#fff',
                                            fontSize: '1rem',
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newPastMembers =
                                                bio.pastMembers.filter(
                                                    (_, i) => i !== index
                                                );
                                            updateBio({
                                                pastMembers: newPastMembers,
                                            });
                                        }}
                                        style={{
                                            padding: '0.75rem',
                                            background: 'none',
                                            border: '1px solid #f44336',
                                            borderRadius: '4px',
                                            color: '#f44336',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newPastMembers = [
                                        ...bio.pastMembers,
                                        '',
                                    ];
                                    updateBio({
                                        pastMembers: newPastMembers,
                                    });
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'none',
                                    border: '1px solid #4CAF50',
                                    borderRadius: '4px',
                                    color: '#4CAF50',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                + Add Past Member
                            </button>
                        </div>

                        {/* Photography Credits */}
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    opacity: 0.8,
                                }}
                            >
                                Photography Credits
                            </label>
                            {bio.photography.map((photo, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '4px',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.5rem',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Photographer Name"
                                            value={photo.name}
                                            onChange={(e) => {
                                                const newPhotography = [
                                                    ...bio.photography,
                                                ];
                                                newPhotography[index] = {
                                                    ...photo,
                                                    name: e.target.value,
                                                };
                                                updateBio({
                                                    photography: newPhotography,
                                                });
                                            }}
                                            style={{
                                                padding: '0.75rem',
                                                background:
                                                    'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '4px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Instagram Handle"
                                            value={photo.instagram}
                                            onChange={(e) => {
                                                const newPhotography = [
                                                    ...bio.photography,
                                                ];
                                                newPhotography[index] = {
                                                    ...photo,
                                                    instagram: e.target.value,
                                                };
                                                updateBio({
                                                    photography: newPhotography,
                                                });
                                            }}
                                            style={{
                                                padding: '0.75rem',
                                                background:
                                                    'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '4px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <input
                                            type="url"
                                            placeholder="Instagram URL"
                                            value={photo.url}
                                            onChange={(e) => {
                                                const newPhotography = [
                                                    ...bio.photography,
                                                ];
                                                newPhotography[index] = {
                                                    ...photo,
                                                    url: e.target.value,
                                                };
                                                updateBio({
                                                    photography: newPhotography,
                                                });
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background:
                                                    'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '4px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const newPhotography =
                                                    bio.photography.filter(
                                                        (_, i) => i !== index
                                                    );
                                                updateBio({
                                                    photography: newPhotography,
                                                });
                                            }}
                                            style={{
                                                padding: '0.75rem',
                                                background: 'none',
                                                border: '1px solid #f44336',
                                                borderRadius: '4px',
                                                color: '#f44336',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newPhotography = [
                                        ...bio.photography,
                                        {
                                            name: '',
                                            instagram: '',
                                            url: '',
                                        },
                                    ];
                                    updateBio({
                                        photography: newPhotography,
                                    });
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'none',
                                    border: '1px solid #4CAF50',
                                    borderRadius: '4px',
                                    color: '#4CAF50',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                + Add Photographer
                            </button>
                        </div>

                        {/* Save All Button */}
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '1rem',
                            }}
                        >
                            <button
                                onClick={async () => {
                                    const success = await updateBio(bio);
                                    if (success) {
                                        setMessage(
                                            '✅ Bio updated successfully'
                                        );
                                    }
                                }}
                                disabled={loading}
                                style={{
                                    padding: '0.75rem 2rem',
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
                                Save All Changes
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '2rem',
                        opacity: 0.6,
                        fontStyle: 'italic',
                    }}
                >
                    Loading bio data...
                </div>
            )}
        </div>
    );
};

export default AdminBio;
