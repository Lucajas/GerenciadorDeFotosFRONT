// index.js

import 'react-native-gesture-handler'; // <-- ADICIONE ISSO AQUI
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// ...
registerRootComponent(App);