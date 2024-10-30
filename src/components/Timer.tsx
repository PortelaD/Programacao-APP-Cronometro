import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { api } from '../services/api/api';
import { formatTime } from '../utils/formatTime';

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [savedTimes, setSavedTimes] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {  
    api.get('/cronometro')
      .then(response => { 
        const [minutes, seconds, millis] = response.data.tempo.split(/[:.]/).map(Number);
        const totalMillis = minutes * 60000 + seconds * 1000 + millis;
        setElapsedTime(totalMillis);
      })
      .catch(error => console.error('Erro ao buscar tempo:', error));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    if (!isRunning) {
      const startTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsedTime(0);
    setIsRunning(false);
    api.put('/cronometro', { tempo: "00:00:00.000" })
      .catch(error => console.error('Erro ao salvar tempo:', error));
  };

  const saveTime = () => {
    const formattedTime = formatTime(elapsedTime);
    setSavedTimes([...savedTimes, formattedTime]);

    api.put('/cronometro', { tempo: formattedTime })
      .catch(error => console.error('Erro ao salvar tempo:', error));
  };

  return (
    <View className="flex-1 w-full items-center justify-center bg-gray-900 p-4">
      <Text className="text-6xl font-extrabold mb-6 text-white">
        {formatTime(elapsedTime)}
      </Text>

      <View className="flex-row space-x-4 mb-6">
        <TouchableOpacity
          className="bg-green-600 px-6 py-3 rounded-full shadow-lg"
          onPress={startTimer}
        >
          <Text className="text-white font-semibold text-lg">Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-yellow-600 px-6 py-3 rounded-full shadow-lg"
          onPress={pauseTimer}
        >
          <Text className="text-white font-semibold text-lg">Pausar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 px-6 py-3 rounded-full shadow-lg"
          onPress={resetTimer}
        >
          <Text className="text-white font-semibold text-lg">Reiniciar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-4 rounded-full shadow-lg mb-6"
        onPress={saveTime}
      >
        <Text className="text-white font-semibold text-lg">Salvar Tempo</Text>
      </TouchableOpacity>

      {/* Lista de tempos salvos */}
      <ScrollView className="w-full max-h-60">
        <Text className="text-xl font-bold mb-4 text-white">Tempos Salvos:</Text>
        {savedTimes.length > 0 ? (
          savedTimes.map((time, index) => (
            <View
              key={index}
              className="bg-gray-800 py-2 px-4 mb-2 rounded-lg shadow-sm"
            >
              <Text className="text-lg text-white">Tempo {index + 1}: {time}</Text>
            </View>
          ))
        ) : (
          <Text className="text-lg text-gray-400">Nenhum tempo salvo ainda.</Text>
        )}
      </ScrollView>
    </View>
  );
}
