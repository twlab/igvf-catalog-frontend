'use client';

import { Next13ProgressBar } from 'next13-progressbar';
import ReduxProvider from './_redux/provider';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ReduxProvider>
                {children}
                <Next13ProgressBar height="4px" color="#ef106a" options={{ showSpinner: false, minimum: 0.25 }} showOnShallow />
            </ReduxProvider>
        </>
    );
};

export default Providers;
