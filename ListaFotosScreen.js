// ListaFotosScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Button, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Importar useIsFocused

// ⚠️ IMPORTANTE: Lembre-se de usar o IP da sua API!
const API_URL = 'http://192.168.1.66:5000'; // Substitua pelo SEU IP

export default function ListaFotosScreen() {
    const [fotos, setFotos] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [fotoSelecionada, setFotoSelecionada] = useState(null);
    
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Hook para saber se a tela está em foco

    // Função para buscar fotos na API
    const buscarFotos = async () => {
        try {
            // Se o termo de busca estiver vazio, busca tudo
            const termo = termoBusca || '%'; 
            const response = await fetch(`${API_URL}/api/fotos?busca=${termo}`);
            if (!response.ok) throw new Error('Falha ao buscar fotos');
            
            const data = await response.json();
            setFotos(data);
            setFotoSelecionada(null); // Limpa a seleção após uma nova busca
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível buscar as fotos.");
        }
    };

    // useEffect para buscar fotos quando a tela carregar OU quando voltar a ter foco
    useEffect(() => {
        if (isFocused) {
            buscarFotos(); // Busca fotos sempre que a tela for exibida
        }
    }, [isFocused]); // A dependência agora é 'isFocused'

    // --- LÓGICA DE NAVEGAÇÃO E SELEÇÃO ---

    // Função para atualizar a lista (será usada como callback)
    const onVoltarEAtualizar = () => {
        buscarFotos(); // A sua função que chama a API
        setFotoSelecionada(null); // Limpa a seleção
    };

    // Navega para a tela de Edição
    const irParaEditar = () => {
        if (!fotoSelecionada) return; // Proteção
        
        navigation.navigate('FotoScreen', {
            foto: fotoSelecionada, // Enviando o objeto da foto para 'Editar'
        });
    };

    // --- LÓGICA DE EXCLUSÃO ---
    const excluirFoto = async () => {
        if (!fotoSelecionada) return;

        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: async () => {
                    try {
                        const response = await fetch(`${API_URL}/api/fotos/${fotoSelecionada.id}`, {
                            method: 'DELETE'
                        });
                        
                        const json = await response.json();
                        if (!response.ok) throw new Error(json.mensagem || 'Erro ao excluir');

                        Alert.alert('Sucesso', 'Foto excluída!');
                        onVoltarEAtualizar(); // Atualiza a lista
                        
                    } catch (error) {
                        Alert.alert('Erro', error.message);
                    }
                }}
            ]
        );
    };


    // --- RENDERIZAÇÃO ---

    // Define qual foto está selecionada ao ser tocada na lista
    const aoSelecionarFoto = (foto) => {
        setFotoSelecionada(foto);
    };

    // Como cada item da lista (FlatList) deve parecer
    const renderItemLista = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemLista} 
            onPress={() => aoSelecionarFoto(item)}
        >
            <Text style={styles.itemTitulo}>Categoria: {item.categoria}</Text>
            <Text style={styles.itemTexto}>Tags: {item.tags}</Text>
        </TouchableOpacity>
    );

    // Constrói a URL completa para a imagem
    const getUrlImagem = (caminho) => {
        // Extrai o nome do arquivo do caminho (ex: "FOTOS/minhafoto.jpg" -> "minhafoto.jpg")
        const nomeArquivo = caminho.split(/[\\/]/).pop();
        return `${API_URL}/static/fotos/${nomeArquivo}`;
    };

    return (
        <View style={styles.container}>
            {/* --- SEÇÃO DE BUSCA --- */}
            <View style={styles.buscaContainer}>
                <TextInput
                    style={styles.buscaInput}
                    placeholder="Buscar por categoria ou tag..."
                    value={termoBusca}
                    onChangeText={setTermoBusca}
                    onSubmitEditing={buscarFotos} // Busca ao pressionar 'Enter'
                />
                <Button title="Buscar" onPress={buscarFotos} />
            </View>

            {/* --- LISTA DE RESULTADOS --- */}
            <FlatList
                style={styles.flatList}
                data={fotos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItemLista}
                ListEmptyComponent={<Text style={styles.listaVazia}>Nenhuma foto encontrada.</Text>}
            />

            {/* --- SEÇÃO DE DETALHES (PRÉVIA DA IMAGEM) --- */}
            <View style={styles.detalhesContainer}>
                {fotoSelecionada ? (
                    // Se uma foto ESTÁ selecionada
                    <View style={styles.previewContent}>
                        <Image
                            source={{ uri: getUrlImagem(fotoSelecionada.caminho_arquivo) }}
                            style={styles.imagemPreview}
                            resizeMode="contain" // Garante que a imagem caiba
                        />
                        <View style={styles.botoesContainer}>
                            <Button title="Editar Metadados" onPress={irParaEditar} />
                            <Button title="Excluir Foto" onPress={excluirFoto} color="#FF4500" />
                        </View>
                    </View>
                ) : (
                    // Se nenhuma foto está selecionada
                    <Text style={styles.placeholderPreview}>
                        Selecione uma foto da lista para ver a prévia e editar.
                    </Text>
                )}
            </View>
        </View>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    buscaContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    buscaInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    flatList: {
        flex: 1, // Faz a lista ocupar o espaço disponível
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    itemLista: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    itemTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemTexto: {
        fontSize: 14,
        color: '#555',
    },
    listaVazia: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
    // --- Estilos da Prévia ---
    detalhesContainer: {
        height: 300, // Altura fixa para a área de preview
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingTop: 10,
    },
    placeholderPreview: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        color: 'gray',
    },
    previewContent: {
        flex: 1,
        alignItems: 'center',
    },
    imagemPreview: {
        width: '90%',
        height: 200, // Altura para a imagem
        marginBottom: 10,
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    }
});