import React, { createContext, useContext } from 'react';
import useSpinData from './hooks/useSpinData';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useTermsStatus } from './hooks/useTermsStatus';

const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const initialData = null

    const [spinData, loading, error, collectedData, playData, blogData, fetchData, loadData, playDetails, blogDetails] = useSpinData(initialData)
    const [termsAccepted, setTermsAcceptedStatus] = useTermsStatus()
    const isConnected = useNetworkStatus()

    return (
        <DataContext.Provider value={{ spinData, loading, error, fetchData, isConnected, playData, blogData, termsAccepted, setTermsAcceptedStatus, playDetails, blogDetails, collectedData, loadData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => useContext(DataContext);
