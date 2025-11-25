import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();

    // Função para navegar para a tela de Adicionar
    // Passamos 'null' como valor da foto e um 'onGoBack' vazio
    const irParaAdicionar = () => {
        navigation.navigate('AddFotoScreen', { 
            foto: null, 
        });
    };

    //Função para navegar para a tela de Gerenciamento
    const irParaGerenciar = () => {
        navigation.navigate('ListaFotos');
    };

    return (
        // Background 
        <ImageBackground 
            source={require('./assets/background.jpg')}
            style={styles.background}
            imageStyle={{ opacity: 0.3 }} //Deixa o fundo mais sutil
            blurRadius={2}
        >
            <View style={styles.overlay} /> 
            <View style={styles.container}>
                <Image
                    source={require('./assets/icon.png')}
                    style={styles.logo}
                />
                <Text style={styles.titulo}>Bem-Vindo(a)</Text>
                <View style={styles.menuBox}>
                    <TouchableOpacity style={styles.botao} onPress={irParaAdicionar}>
                        <Text style={styles.textoBotao}>Adicionar fotos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botao} onPress={irParaGerenciar}>
                        <Text style={styles.textoBotao}>Gerenciar fotos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)', // "Véu" escuro
        zIndex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 2, // Garante que o conteúdo fique acima do véu
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 32,
        fontWeight: '200',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 40,
    },
    menuBox: {
        width: '90%',
        backgroundColor: 'rgba(236, 250, 250, 0.7)', // Branco semi-transparente
        borderRadius: 32,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 1,
    },
    botao: {
        backgroundColor: '#cfe7e7ff', // Cinza dos botões
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 20,
        marginTop: 20,
        borderColor: '#24222bff',
        borderWidth: 1,
        elevation: 5,
    },
    textoBotao: {
        textAlign: 'center',
        color: '#24222bff',
        fontSize: 20,
        fontWeight: '500',
    }

});
