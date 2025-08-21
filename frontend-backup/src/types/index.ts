// Re-export shared types for convenience
export * from '@shared/types/models';
export * from '@shared/types/api';
export * from '@shared/constants/products';

// Frontend-specific types
export interface ComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface AdminComponentProps {
    setMessage: (message: string) => void;
    message: string;
    loading?: boolean;
}
