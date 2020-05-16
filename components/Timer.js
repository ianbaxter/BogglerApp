import React, {useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {Picker} from '@react-native-community/picker';

const Timer = () => {
  const [timer, setTimer] = useState('03:00');
  const [timerStart, setTimerStart] = useState('03:00');
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [isTimeUp, setIsTimeUp] = useState(false);

  const setNewTimer = (newTimer) => {
    setTimer(newTimer);
    setTimerStart(newTimer);
  };

  const startCountdown = () => {
    if (!playing) {
      setPlaying(true);
      let seconds = timer.split(':')[0] * 60 + timer.split(':')[1] * 1;
      let newIntervalId = setInterval(() => {
        if (seconds > 0) {
          seconds--;
          let newTimer =
            '0' +
            Math.floor(seconds / 60) +
            ':' +
            (seconds % 60 > 9 ? seconds % 60 : '0' + (seconds % 60));
          setTimer(newTimer);
        } else {
          clearInterval(intervalId);
          setIsTimeUp(true);
        }
      }, 1000);
      setIntervalId(newIntervalId);
    } else if (playing) {
      setPlaying(false);
      clearInterval(intervalId);
      setTimer(timerStart);
      if (isTimeUp) setIsTimeUp(false);
    }
  };

  return (
    <View>
      <Button onPress={startCountdown} title={playing ? 'Reset' : 'Start'} />
      {playing ? (
        <Text
          style={[
            styles.countdown,
            isTimeUp ? styles.countdown__Timeup : false,
          ]}>
          {timer}
        </Text>
      ) : (
        <View style={styles.timerContainer}>
          <Text style={styles.pickerLabel}>Timer:</Text>
          <Picker
            style={styles.timePicker}
            onValueChange={setNewTimer}
            selectedValue={timer}>
            <Picker.Item label="01:00" value="01:00" />
            <Picker.Item label="01:30" value="01:30" />
            <Picker.Item label="02:00" value="02:00" />
            <Picker.Item label="03:00" value="03:00" />
            <Picker.Item label="04:00" value="04:00" />
            <Picker.Item label="05:00" value="05:00" />
          </Picker>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'lightblue',
  },
  timePicker: {flex: 1},
  pickerLabel: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 16,
    paddingLeft: 8,
  },
  countdown: {
    height: 52,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countdown__Timeup: {
    backgroundColor: 'red',
    color: 'white',
  },
});

export default Timer;
