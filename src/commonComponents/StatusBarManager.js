import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

const StatusBarManager = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor("#8A2BE2");
    StatusBar.setBarStyle("light-content");
  }, []);

  return <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />;
};

export default StatusBarManager;
