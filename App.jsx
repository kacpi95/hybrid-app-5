import { StyleSheet } from 'react-native';
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
  const playerStrength = 8;

  const [playerStamina, setPlayerStamina] = useState(60);
  const [enemy, setEnemy] = useState(
    enemies[Math.floor(Math.random() * enemies.length)]
  );
  const [enemyStamina, setEnemyStamina] = useState(50);
  const [result, setResult] = useState('');
  const [gameOver, setGameOver] = useState(false);
  return;
}

const styles = StyleSheet.create({});
