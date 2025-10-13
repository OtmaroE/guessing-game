import { View, StyleSheet, Pressable } from 'react-native';
import {useEffect, useState} from 'react';

function orderGenerator() {
  const list = [];
  for (let i = 0; i < 4; i++) {
    const number = Math.floor(Math.random() * 100) + 1;
    list.push(number);
    list.push(number);
  }
  list.push(-1);
  return list.sort(() => Math.random() - 0.5);
}

function toggleNumber(visibleNumbers: number[], setVisibleNumbers: (numbers: number[]) => void, number: number) {
  // TODO: Could this be useful to keep track of history?
  const newSet = new Set(visibleNumbers);
  if (visibleNumbers.has(number)) {
    newSet.delete(number);
  } else {
    newSet.add(number);
  }
  return setVisibleNumbers(newSet);
}

function evaluate(visibleNumbers: number[], setVisibleNumbers: (numbers: number[]) => void) {
  if (visibleNumbers.length === 0) return;
  console.log('Evaluating...');
  // gather all numner
  const numbers = [];
  for (const index of visibleNumbers) {
    numbers.push(list[index]);
  };
  console.log('On board: ', numbers);

}
// Value to not change for the lifecycle of the component
const list = orderGenerator();
export default function TabTwoScreen() {
  const [visibleNumbers, setVisibleNumbers] = useState(new Set());
  const [evaluationRound, setEvaluationRound] = useState(true);

  useEffect(() => {
    if (evaluationRound) evaluate(visibleNumbers, setVisibleNumbers);
  }, [evaluationRound])

  return (
      <View style={styles.container} >
        {Array.from({ length: 9 }).map((_, idx) => (
          <Pressable
            key={idx}
            onPress={() => {
              toggleNumber(visibleNumbers, setVisibleNumbers, idx);
              setEvaluationRound(!evaluationRound);
            }
            }
          >
            <View key={idx} style={styles.box} >
              {
                visibleNumbers.has(idx) &&
                <div id={`${idx}-number`} style={styles.boxText}>{list[idx]}</div>
              }
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
  boxText: {
    fontSize: 18,
  }
});
