import React, { createContext, useContext } from 'react';
import useSpinData from './hooks/useSpinData';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useTermsStatus } from './hooks/useTermsStatus';
import useLanguage from './hooks/useLanguage';

const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const initialData = null
    const initiallanguage = "en"

    const [spinData, loading, error, collectedData, playData, blogData, fetchData, loadData, playDetails, blogDetails] = useSpinData(initialData)
    const [termsAccepted, setTermsAcceptedStatus] = useTermsStatus()
    const isConnected = useNetworkStatus()
    const [language, updateLanguage] = useLanguage(initiallanguage)

    return (
        <DataContext.Provider value={{ spinData, loading, error, fetchData, isConnected, playData, blogData, termsAccepted, setTermsAcceptedStatus, playDetails, blogDetails, collectedData, loadData, language, updateLanguage }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => useContext(DataContext);
