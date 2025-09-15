import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ children }) => {
  const [error, setError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const handleError = (error: unknown) => {
      console.error('Global error:', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('An unexpected error occurred');
      }
    };

    // Set up global error handler for React Query
    queryClient.setDefaultOptions({
      queries: {
        throwOnError: false,
      },
      mutations: {
        throwOnError: false,
      },
    });

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [queryClient]);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      {children}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GlobalErrorHandler;