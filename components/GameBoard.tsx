import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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

export default function GameBoard() {
  const [evaluationRound, setEvaluationRound] = useState<boolean>(true);
  const [boardState, setBoardState] = useState<GameItem[]>(orderGenerator());

  useEffect(() => {
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

  const toggleNumber = (touchedIndex: number): void => {
    const visibleUnsolved = boardState.filter(item => item.visible && !item.solved);
    if (visibleUnsolved.length >= 2) return;
    
    const foundItem = boardState[touchedIndex];
    if (foundItem.solved || foundItem.visible) return;

    setBoardState(prevState => 
      prevState.map((item, index) => 
        index === touchedIndex 
          ? { ...item, visible: true }
          : item
      )
    );
  }

  const getBoxContent = (item: GameItem) => {
    if (!item.visible && !item.solved) return null;
    if (item.value === -1) {
      return (
        <img 
          src='../assets/images/death.png' 
          style={{ width: '100%', height: '100%' }}
          alt="death"
        />
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
    <View style={styles.container}>
      {Array.from({ length: GRID_SIZE }).map((_, idx) => (
        <Pressable
          key={`cell-${idx}`}
          onPress={() => {
            toggleNumber(idx);
            setEvaluationRound(prev => !prev);
          }}
        >
          <View style={boardState[idx].solved ? styles.solvedBox : styles.box}>
            {getBoxContent(boardState[idx])}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
