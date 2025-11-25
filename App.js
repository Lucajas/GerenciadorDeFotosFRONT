import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Importa as três telas
import HomeScreen from './HomeScreen';
import ListaFotosScreen from './ListaFotosScreen'; 
import FotoScreen from './AddFotoScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        //Define a 'Home' como a tela inicial
        initialRouteName="Home" 
      >
        
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="ListaFotos"
          component={ListaFotosScreen}
          options={{ title: 'Gerenciar Fotos' }}
        />
        <Stack.Screen 
          name="FotoScreen"
          component={FotoScreen}
          options={({ route }) => ({ 
            title: route.params.foto ? 'Editar Foto' : 'Adicionar Nova Foto' 
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
