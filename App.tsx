import React from 'react';
import { Text, View } from 'react-native';
import Timer from './src/components/Timer';

export default function App() {
  return (
    <View className="flex w-full items-center justify-center flex-1 bg-gray-500">
        <Timer />
    </View>
  ); 
};

