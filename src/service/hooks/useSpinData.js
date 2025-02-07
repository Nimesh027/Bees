import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useNetworkStatus } from './useNetworkStatus';
import { ToastAndroid } from 'react-native';

const BASE_URL = 'https://coinmasterfreespin.tech'

const useSpinData = (initialData) => {
  const [spinData, setSpinData] = useState(initialData || []);
  const [playData, setPlayData] = useState(initialData || [])
  const [blogData, setBlogData] = useState(initialData || [])
  const [collectedData, setCollectedData] = useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isConnected = useNetworkStatus();

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/rewards.php`);
      setSpinData(response.data);
      setError(null);
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError('Network Error');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const playDetails = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/play.php`);
      setPlayData(response.data);
      setError(null);
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError('Network Error');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const blogDetails = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/blog.php`);
      setBlogData(response.data);
      setError(null);
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError('Network Error');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadData = (data) => {
    if (data) {
      setCollectedData(data)
    } else {
      ToastAndroid.show('Error loading data', ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchData();
      playDetails();
      blogDetails();

    } else {
      setError('Network Error');
      setLoading(false);
    }
  }, [isConnected]);

  return [spinData, loading, error, collectedData, playData, blogData, fetchData, loadData, playDetails, blogDetails];
};

export default useSpinData;
