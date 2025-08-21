import { useEffect } from 'react';

const ImagePreloader: React.FC = () => {
    useEffect(() => {
        // Preload critical images
        const imagesToPreload = [
            '/assets/images/HopeFailure-BandPic.jpg',
            // '/assets/images/HopeFailure BlockLogo - Vector - White - Horizontal.png',
            // '/assets/images/HopeFailure BlockLogo - Vector - White - Vertical.png',
            // '/assets/images/Lunasa Cascadia 2023 Black and White.png',
        ];

        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return null; // This component doesn't render anything
};

export default ImagePreloader;
