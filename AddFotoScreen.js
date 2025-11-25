// FotoScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const API_URL = 'http://192.168.1.66:5000';

export default function FotoScreen({ route, navigation }) {
    const { foto, onGoBack } = route.params;
    const [data, setData] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tags, setTags] = useState('');
    const [imagemUri, setImagemUri] = useState(null);
  
    useEffect(() => {
        if (foto) {
            const dataFormatada = new Date(foto.data).toLocaleDateString('pt-BR');
            setData(dataFormatada);
            setCategoria(foto.categoria);
            setTags(foto.tags);
        }
    }, [foto]);

    //Lógica para selecionar imagem só no modo Adicionar
    const selecionarImagem = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
            return;
        }

            let resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
            });

        if (!resultado.canceled) {
            setImagemUri(resultado.assets[0].uri);
        }
    };

    //Lógica para salvar
    const salvarFoto = () => {
        if (foto) {
            // (PUT)
            _atualizarFoto();
        } else {
            //  (POST)
            _adicionarFoto();
        }
    };

    const _adicionarFoto = async () => {
        if (!imagemUri || !data || !categoria || !tags) {
            Alert.alert('Erro', 'Todos os campos e a imagem são obrigatórios.');
            return;
        }

        const formData = new FormData();
        formData.append('data', data);
        formData.append('categoria', categoria);
        formData.append('tags', tags);

        const uriParts = imagemUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('imagem', {
            uri: imagemUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });

        try {
            const response = await fetch(`${API_URL}/api/fotos`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const json = await response.json();
            if (!response.ok) throw new Error(json.mensagem || 'Erro ao adicionar foto');

            Alert.alert('Sucesso', 'Foto adicionada!');
            if (onGoBack) onGoBack(); // Chama o callback para atualizar a lista anterior
            navigation.goBack(); // Volta para a tela anterior
            
        } catch (error) {
            Alert.alert('Erro no Upload', error.message);
        }
    };

    const _atualizarFoto = async () => {
        try {
            const response = await fetch(`${API_URL}/api/fotos/${foto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data, categoria, tags }),
            });

            const json = await response.json();
            if (!response.ok) throw new Error(json.mensagem || 'Erro ao atualizar foto');
            
            Alert.alert('Sucesso', 'Foto atualizada!');
            if (onGoBack) onGoBack(); // Chama o callback para atualizar a lista anterior
            navigation.goBack(); // Volta para a tela anterior

        } catch (error) {
            Alert.alert('Erro ao Atualizar', error.message);
        }
    };

    const scrollViewRef = useRef(null);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: '#f7fafd' }}
                keyboardShouldPersistTaps="always"
            >
                {!foto && (
                    <TouchableOpacity style={styles.imagemPicker} onPress={selecionarImagem} activeOpacity={0.7}>
                        {imagemUri ? (
                            <Image source={{ uri: imagemUri }} style={styles.imagemPreview} />
                        ) : (
                            <Text style={styles.textoImagemPicker}>Selecionar Imagem</Text>
                        )}
                    </TouchableOpacity>
                )}

                <Text style={styles.label}>Data (DD/MM/AAAA):</Text>
                <TextInput
                    style={styles.input}
                    value={data}
                    onChangeText={setData}
                    placeholder="Ex: 25/12/2025"
                />

                <Text style={styles.label}>Categoria:</Text>
                <TextInput
                    style={styles.input}
                    value={categoria}
                    onChangeText={setCategoria}
                    placeholder="Ex: Viagem"
                />

                <Text style={styles.label}>Tags (separadas por vírgula):</Text>
                <TextInput
                    style={styles.input}
                    value={tags}
                    onChangeText={setTags}
                    placeholder="Ex: praia, sol, ferias"
                />

                <TouchableOpacity style={styles.botaoSalvar} onPress={salvarFoto} activeOpacity={0.8}>
                    <Text style={styles.textoBotaoSalvar}>Salvar</Text>
                </TouchableOpacity>
                {/* Espaço extra para garantir rolagem */}
                <View style={{ height: 120 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f7fafd',
    },
    imagemPicker: {
        height: 180,
        borderWidth: 2,
        borderColor: '#b0c4de',
        borderStyle: 'dashed',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: '#eaf1fb',
    },
    textoImagemPicker: {
        color: '#7a8fa6',
        fontSize: 16,
        fontWeight: '500',
    },
    imagemPreview: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        resizeMode: 'cover',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#2d3a4a',
        fontWeight: '600',
    },
    input: {
        height: 44,
        borderColor: '#b0c4de',
        borderWidth: 1.5,
        marginBottom: 18,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 15,
        color: '#2d3a4a',
    },
    botaoSalvar: {
        backgroundColor: '#4f8cff',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4f8cff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    textoBotaoSalvar: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

});
