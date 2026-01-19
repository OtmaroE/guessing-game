import GameBoard from '@/components/GameBoard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Game() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  return (
    <View>
      <GameBoard />
      { !gameStarted &&
        <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setGameStarted(true)}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>About</Text>
        </Pressable>
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});