import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
const GRID_SIZE = 9;
const PAIRS_COUNT = 4;
const DELAY_MS = 1000;

interface GameItem {
  value: number;
  solved: boolean;
  index: number;
  visible: boolean;
}

function orderGenerator(): GameItem[] {
  const numbers: number[] = [];
  for (let i = 0; i < PAIRS_COUNT; i++) {
    const number = Math.floor(Math.random() * 100) + 1;
    numbers.push(number, number);
  }
  numbers.push(-1); // Empty space

  return numbers
    .sort(() => Math.random() - 0.5)
    .map((value, index): GameItem => ({
      value,
      solved: false,
      index,
      visible: false
    }));
}

export default function GameBoard({ pairsLeft, onPairLeftChange }: { pairsLeft: number, onPairLeftChange: (pairsLeft: number) => void }) {
  const [evaluationRound, setEvaluationRound] = useState<boolean>(true);
  const [boardState, setBoardState] = useState<GameItem[]>(orderGenerator());

  useEffect(() => {
    onPairLeftChange(4 - boardState.filter(item => item.solved).length / 2);
    if (evaluationRound) {
      const timer = setTimeout(() => {
        evaluateBoard();
      }, DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [evaluationRound, boardState]); // Add boardState as dependency


  const evaluateBoard = (): void => {
    const visibleItems = boardState.filter(item => item.visible && !item.solved);
    if (visibleItems.length !== 2) return;

    const [firstItem, secondItem] = visibleItems;
    const matched = firstItem.value === secondItem.value;

    setBoardState(prevState => 
      prevState.map(item => {
        if (!visibleItems.some(v => v.index === item.index)) return item;
        return {
          ...item,
          solved: matched ? true : false,
          visible: matched ? true : false
        };
      })
    );
  }

  const tryToggle = (touchedIndex: number) => {
    const visibleUnsolved = boardState.filter(item => item.visible && !item.solved);
    if (evaluationRound && visibleUnsolved.length > 0) return false;
    if (visibleUnsolved.length >= 2) return false;

    const foundItem = boardState[touchedIndex];
    if (foundItem.solved || foundItem.visible) return false;

    setBoardState(prevState =>
      prevState.map((item, index) =>
        index === touchedIndex ? { ...item, visible: true } : item
      )
    );
    setEvaluationRound(prev => !prev);
  }

  const getBoxContent = (item: GameItem) => {
    if (!item.visible && !item.solved) return null;
    if (item.value === -1) {
      return (
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/death.png')}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel="death"
          />
        </View>
      );
    }
    return (
      <div 
        style={item.solved? styles.solvedBoxText : styles.boxText}
        id={`number-${item.index}`}
      >
        {item.value}
      </div>
    );
  }


  return (
    <View>
      <Text style={styles.title}>
        {pairsLeft === 0 ? "You Won!" : `${pairsLeft} pairs left to find`}
      </Text>
      <View style={styles.container}>
        {Array.from({ length: GRID_SIZE }).map((_, idx) => (
          <Pressable
            key={`cell-${idx}`}
            onPress={() => tryToggle(idx)}
          >
            <View style={boardState[idx].solved ? styles.solvedBox : styles.box}>
              {getBoxContent(boardState[idx])}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    padding: 50,
    width: '100%',
    maxWidth: 356, // (80px box width * 3) + (8px gap * 2) + (50px padding * 2)
    alignSelf: 'center', // Centers the container itself
  },
  box: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#132cd9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solvedBox: {
    width: 80,
    height: 80,
    backgroundColor: '#acf383ff',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#28aee2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solvedBoxText: {
    fontSize: 18,
    color: 'gray',
  },
  boxText: {
    fontSize: 18,
  }
  ,
  imageWrapper: {
    width: '100%',
    height: '100%',
    padding: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
