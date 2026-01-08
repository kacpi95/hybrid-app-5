import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import Enemy from './components/Enemy/Enemy';
import { useState } from 'react';

const enemies = [
  {
    name: 'Orc',
    strength: 10,
    image: require('./assets/orc.jpg'),
  },
  { name: 'Goblin', strength: 6, image: require('./assets/goblin.jpg') },
  { name: 'Troll', strength: 8, image: require('./assets/troll.jpg') },
];

export default function App() {
  const SERVER_URL = 'http://localhost:4000';
  const WS_URL = 'ws://localhost:4000';

  const wsRef = useRef(null);

  const playerStrength = 8;

  const [playerStamina, setPlayerStamina] = useState(60);
  const [enemy, setEnemy] = useState(
    enemies[Math.floor(Math.random() * enemies.length)]
  );
  const [enemyStamina, setEnemyStamina] = useState(50);
  const [result, setResult] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const loadEnemy = async () => {
    const res = await fetch(`${SERVER_URL}/return-monster`);
    const data = await res.json();

    setEnemy({
      name: data.race,
      strength: data.strength,
      image: enemyImages[data.race],
    });
    setEnemyStamina(data.stamina);
  };

  const rollDamage = (strength) => {
    const random = Math.floor(Math.random() * 6) + 1;
    return Math.floor((random * strength) / 5);
  };

  const resetGame = () => {
    setPlayerStamina(60);
    setEnemy(enemies[Math.floor(Math.random() * enemies.length)]);
    setEnemyStamina(50);
    setResult('');
    setGameOver(false);
  };

  const fightRound = () => {
    if (gameOver) return;

    const playerHit = rollDamage(playerStrength);
    const enemyHit = rollDamage(enemy.strength);

    const newPlayerStamina = playerStamina - enemyHit;
    const newEnemyStamina = enemyStamina - playerHit;

    setPlayerStamina(newPlayerStamina);
    setEnemyStamina(newEnemyStamina);

    if (newEnemyStamina <= 0 && newPlayerStamina <= 0) {
      setResult('Remis!');
      setGameOver(true);
    } else if (newEnemyStamina <= 0) {
      setResult('Zwycięstwo!');
      setGameOver(true);
    } else if (newPlayerStamina <= 0) {
      setResult('Porażka...');
      setGameOver(true);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>⚔️ Pojedynek ⚔️</Text>

        <View style={styles.section}>
          <Text style={styles.title}>Gracz</Text>
          <Text style={styles.stat}>Siła: {playerStrength}</Text>
          <Image
            source={require('./assets/hero.jpg')}
            style={styles.playerImage}
          />
          <Text style={styles.stat}>Wytrzymałość: {playerStamina}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Przeciwnik</Text>
          <Enemy
            name={enemy.name}
            strength={enemy.strength}
            image={enemy.image}
          />
          <Text style={styles.stat}>Wytrzymałość: {enemyStamina}</Text>
        </View>

        {!gameOver && (
          <View style={styles.buttonContainer}>
            <Button title='⚔️ Następna runda' onPress={fightRound} />
          </View>
        )}

        {gameOver && (
          <View style={styles.buttonContainer}>
            <Button title='🔄 Spróbuj ponownie' onPress={resetGame} />
          </View>
        )}

        {result !== '' && <Text style={styles.result}>{result}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: '#1b1b1b',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    color: '#f5f5f5',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    color: '#b62525ff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerImage: {
    width: 120,
    height: 120,
    marginTop: 10,
    borderRadius: 8,
  },
  text: {
    color: '#eee',
    fontSize: 16,
  },
  result: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: 'bold',
    color: '#00ff99',
  },
  stat: {
    marginTop: 15,
    color: '#ddd',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
});
