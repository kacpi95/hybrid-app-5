import { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';


export default function Enemy({ name, strength, image }) {
  const [stamina, setStamina] = useState(50);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>

      {image && <Image source={image} style={styles.image} />}

      <Text style={styles.stat}>Siła: {strength}</Text>
      <Text style={styles.stat}>Wytrzymałość: {stamina}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    width: '100%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    marginVertical: 10,
    borderRadius: 8,
  },
  stat: {
    color: '#ddd',
    fontSize: 16,
  },
});
