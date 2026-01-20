import GameBoard from '@/components/GameBoard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Game() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      { gameStarted && <GameBoard />}
      { !gameStarted &&
        <View style={styles.buttonContainer }>
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
      {
        gameStarted &&
        <Pressable style={styles.button} onPress={() => setGameStarted(false)}>
          <Text style={styles.buttonText}>End Game</Text>
        </Pressable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#007bffbb',
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