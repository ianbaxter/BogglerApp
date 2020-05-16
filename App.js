import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, Clipboard} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Timer from './components/Timer';
import diceBag from './diceBag';

const App = () => {
  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState('fiveByFiveDice');

  useEffect(() => {
    setBoard(newBoard(diceBag.fiveByFiveDice));
  }, []);

  const newBoard = (dice) => {
    const emptyBoard = Array.from({length: dice.length}, () =>
      Math.floor(Math.random() * 6),
    );

    const board = emptyBoard.map((value, idx) => dice[idx][value]);

    shakeDice(board);

    function shakeDice(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    return board;
  };

  const resetBoard = () => {
    board.length === 16
      ? setBoard(newBoard(diceBag.fourByFOurDice))
      : board.length === 25
      ? setBoard(newBoard(diceBag.fiveByFiveDice))
      : setBoard(newBoard(diceBag.sixBySixDice));
  };

  const changeBoardSize = (boardSize) => {
    setBoardSize(boardSize);
    switch (boardSize) {
      case 'fourByFOurDice':
        setBoard(newBoard(diceBag.fourByFOurDice));
        break;
      case 'fiveByFiveDice':
        setBoard(newBoard(diceBag.fiveByFiveDice));
        break;
      case 'sixBySixDice':
        setBoard(newBoard(diceBag.sixBySixDice));
        break;
      default:
        setBoard(newBoard(diceBag.fiveByFiveDice));
        break;
    }
  };

  const copyBoard = () => {
    let secretBoard = board.map((value) => {
      if (value === '#' || value.length === 2) {
        return value;
      } else if (value === 'Z') return 'A';
      return String.fromCharCode(value.charCodeAt(0) + 1);
    });
    let copyText = secretBoard.join('');
    Clipboard.setString(copyText);
  };

  const pasteBoard = async () => {
    const text = await Clipboard.getString();
    const codedBoard = text.split(/(?=[A-Z#])/);
    const decodedBoard = codedBoard.map((value) => {
      if (value === '#' || value.length === 2) {
        return value;
      } else if (value === 'A') return 'Z';
      return String.fromCharCode(value.charCodeAt(0) - 1);
    });
    if (decodedBoard.length === board.length) setBoard(decodedBoard);
  };

  return (
    <View style={styles.appContainer}>
      <Timer />
      <View style={styles.boardContainer}>
        {board.map((value, index) => {
          return (
            <Text
              key={index}
              style={[
                styles.dice,
                board.length === 16
                  ? styles.dice__4x4
                  : board.length === 25
                  ? styles.dice__5x5
                  : styles.dice__6x6,
              ]}>
              {value}
            </Text>
          );
        })}
      </View>
      <View>
        <View style={styles.boardOptions}>
          <Text style={styles.pickerLabel}>Board Size:</Text>
          <Picker
            style={styles.boardPicker}
            onValueChange={changeBoardSize}
            selectedValue={boardSize}>
            <Picker.Item label="4x4" value="fourByFOurDice" />
            <Picker.Item label="5x5" value="fiveByFiveDice" />
            <Picker.Item label="6x6" value="sixBySixDice" />
          </Picker>
        </View>
        <View style={styles.btn}>
          <Button
            style={styles.btnText}
            title="Shuffle Board"
            onPress={resetBoard}></Button>
        </View>
        <View style={styles.btn}>
          <Button title="Copy Board" onPress={copyBoard} />
        </View>
        <View>
          <Button title="Paste Board" onPress={pasteBoard} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#e7f5fe',
  },
  boardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'lightskyblue',
    padding: 3,
  },
  dice: {
    backgroundColor: 'white',
    margin: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: 7,
    borderStyle: 'solid',
    borderColor: '#222',
  },
  dice__4x4: {
    width: '24.5%',
    height: '24.5%',
    fontSize: 60,
  },
  dice__5x5: {
    width: '19.5%',
    height: '19.5%',
    fontSize: 48,
  },
  dice__6x6: {
    width: '16.1%',
    height: '16.1%',
    fontSize: 40,
  },
  boardOptions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'lightblue',
  },
  boardPicker: {flex: 1},
  pickerLabel: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 16,
    paddingLeft: 8,
  },
  btn: {
    borderBottomWidth: 0.8,
    borderColor: 'lightblue',
  },
});

export default App;
