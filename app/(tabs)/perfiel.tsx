import { FontAwesome } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const produtosSalvos = [
  { id: '1', nome: 'Produto', imagem: require('@/assets/images/tijolo.png') },
  { id: '2', nome: 'Produto', imagem: require('@/assets/images/tijolo.png') },
  { id: '3', nome: 'Produto', imagem: require('@/assets/images/tijolo.png') },
  { id: '4', nome: 'Produto', imagem: require('@/assets/images/tijolo.png') },
  { id: '5', nome: 'Produto', imagem: require('@/assets/images/tijolo.png') },
  { id: '6', nome: 'Produto', imagem: require('@/assets/images/tijolo.png') },
];

export default function Perfil() {
  return (
    <View style={styles.container}>
      <FontAwesome name="user-circle" size={80} color="black" style={styles.avatar} />
      <Text style={styles.nome}>Luiz Eduardo</Text>
      <Text style={styles.endereco}>Local para entrega: Rua Claudia Linda, 60</Text>

      <View style={styles.salvosContainer}>
        <FontAwesome name="heart" size={20} color="orangered" />
        <Text style={styles.salvosTexto}>salvos</Text>
      </View>

      <FlatList
        data={produtosSalvos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.produto}>
            <Image source={item.imagem} style={styles.imagemProduto} />
            <Text style={styles.nomeProduto}>"{item.nome}"</Text>
          </View>
        )}
        contentContainerStyle={styles.listaProdutos}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    marginBottom: 10,
    top: 30,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 50,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    top: 30,
    color: '#2563eb',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.5,
  },
  endereco: {
    textAlign: 'center',
    marginVertical: 10,
    top: 30,
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
  salvosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    top: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  salvosTexto: {
    marginLeft: 6,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
  listaProdutos: {
    top: 150,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  produto: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagemProduto: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nomeProduto: {
    marginTop: 5,
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
  menu: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
