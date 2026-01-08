import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image, View, Text } from 'react-native';

export default function Enemy({ name, strenght, image }) {
  const [stamina, setStamina] = useState(50);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {image && <Image source={image} style={styles.image} />}
      <Text style={styles.strenght}>Siła: {strenght}</Text>
      <Text style={styles.stamina}>Wytrzymałość: {stamina}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
