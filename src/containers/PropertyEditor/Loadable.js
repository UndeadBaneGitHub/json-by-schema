import React, { Suspense, lazy } from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';

const LazyComponent = lazy(() => import('./index'));

export default function LoadableComponent(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
