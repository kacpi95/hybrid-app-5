import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import Enemy from './components/Enemy/Enemy';
import { useEffect, useRef, useState } from 'react';

const enemyImages = {
  goblin: require('./assets/goblin.jpg'),
  orc: require('./assets/orc.jpg'),
  troll: require('./assets/troll.jpg'),
};

export default function App() {
  const SERVER_URL = 'http://localhost:4000';
  const WS_URL = 'ws://localhost:4000';

  const wsRef = useRef(null);

  const playerStrength = 8;

  const [playerStamina, setPlayerStamina] = useState(60);
  const [enemy, setEnemy] = useState(null);
  const [enemyStamina, setEnemyStamina] = useState(0);
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

  useEffect(() => {
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onmessage = (msg) => {
      if (gameOver) return;

      const event = JSON.parse(msg.data);
      if (event.type === 'BUFF') {
        if (event.strengthBoost) {
          setEnemy((prev) => ({
            ...prev,
            strength: prev.strength + event.strengthBoost,
          }));
        }
        if (event.staminaBoost) {
          setEnemyStamina((prev) => prev + event.staminaBoost);
        }
      }
    };

    return () => wsRef.current?.close();
  }, [gameOver]);

  useEffect(() => {
    loadEnemy();
  }, []);

  const rollDamage = (strength) =>
    Math.floor((Math.random() * strength) / 2) + 1;

  const fightRound = () => {
    if (gameOver || !enemy) return;

    const playerHit = rollDamage(playerStrength);
    const enemyHit = rollDamage(enemy.strength);

    const newPlayer = playerStamina - enemyHit;
    const newEnemy = enemyStamina - playerHit;

    setPlayerStamina(newPlayer);
    setEnemyStamina(newEnemy);

    if (newEnemy <= 0 && newPlayer <= 0) {
      setResult('Remis!');
      setGameOver(true);
    } else if (newEnemy <= 0) {
      setResult('Zwycięstwo!');
      setGameOver(true);
    } else if (newPlayer <= 0) {
      setResult('Porażka...');
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setPlayerStamina(60);
    setResult('');
    setGameOver(false);
    loadEnemy();
  };

  if (!enemy) return <Text>Loading...</Text>;

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

        {!gameOver ? (
          <Button title='⚔️ Następna runda' onPress={fightRound} />
        ) : (
          <Button title='🔄 Spróbuj ponownie' onPress={resetGame} />
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
