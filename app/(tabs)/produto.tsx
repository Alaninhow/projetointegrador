import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const produtos = [
  { id: '1', nome: 'Tijolo Ecológico', preco: 'R$ 2,50', status: 'Disponível', caracteristicas: ['Sustentável', 'Alta resistência', 'Fácil de assentar'], descricao: 'Tijolo ecológico feito com material reciclado.', imagem: require('@/assets/images/tijolo.png') },
  { id: '2', nome: 'Tijolo Quadrado', preco: 'R$ 3,00', status: 'Poucas unidades', caracteristicas: ['Formato quadrado', 'Ideal para muros'], descricao: 'Tijolo quadrado para acabamentos diferenciados.', imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg') },
  { id: '3', nome: 'Tijolo Retangular', preco: 'R$ 3,20', status: 'Disponível', caracteristicas: ['Formato retangular', 'Versátil'], descricao: 'Tijolo retangular para diversas aplicações.', imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg') },
  { id: '4', nome: 'Vaso Quadrado', preco: 'R$ 12,00', status: 'Disponível', caracteristicas: ['Decoração', 'Resistente'], descricao: 'Vaso quadrado feito com tijolo ecológico.', imagem: require('@/assets/images/vaso-quadrado.jpg') },
  { id: '5', nome: 'Vaso Retangular', preco: 'R$ 18,00', status: 'Esgotado', caracteristicas: ['Decoração', 'Grande porte'], descricao: 'Vaso retangular para jardins.', imagem: require('@/assets/images/vaso-retangular.jpg') },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const drawerWidth = SCREEN_WIDTH * 0.7;

export default function ProdutosScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-drawerWidth));
  const router = useRouter();

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -drawerWidth,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setDrawerOpen(false));
  };

  const renderItem = ({ item }: any) => (
    <ThemedView card style={styles.card}>
      <Image source={item.imagem} style={styles.imagem} />
      <Text style={styles.nomeProduto}>{item.nome}</Text>
      <Text style={styles.precoProduto}>{item.preco}</Text>
      <Text style={styles.statusProduto}>{item.status}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <View style={styles.caracteristicasContainer}>
        {item.caracteristicas.map((c: string, idx: number) => (
          <View key={idx} style={styles.caracteristicaTag}>
            <Text style={styles.caracteristicaText}>{c}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.botaoComprar}>
        <Text style={styles.textoBotaoComprar}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      {/* Drawer */}
      {drawerOpen && (
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={closeDrawer} />
      )}
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerTitle}>Menu</Text>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { closeDrawer(); router.replace('/'); }}>
            <FontAwesome name="home" size={22} color="#f59e42" />
            <Text style={styles.drawerItemText}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { closeDrawer(); router.push('/(tabs)/perfiel'); }}>
            <FontAwesome name="user" size={22} color="#f59e42" />
            <Text style={styles.drawerItemText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { closeDrawer(); router.push('/(tabs)/sobre'); }}>
            <FontAwesome name="info-circle" size={22} color="#f59e42" />
            <Text style={styles.drawerItemText}>Sobre</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* Header com menu hamburger */}
      <View style={styles.headerModern}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <FontAwesome name="bars" size={28} color="#f59e42" />
        </TouchableOpacity>
      </View>
      <Text style={styles.titulo}>Produtos ecológicos</Text>
      <FlatList
        data={produtos}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', paddingTop: 56 },
  titulo: { fontSize: 28, marginTop: 50, marginBottom: 30, fontWeight: '700', color: '#2563eb', fontFamily: 'SpaceMono' },
  lista: { paddingBottom: 120, paddingHorizontal: 20, gap: 30 },
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
    // Sombra e cor agora via ThemedView
  },
  imagem: { width: 300, height: 200, resizeMode: 'contain', borderRadius: 12 },
  texto: { marginTop: 15, fontSize: 22, fontWeight: '600', fontFamily: 'SpaceMono', color: '#1f2937' },
  descricao: { fontSize: 16, color: '#333', marginTop: 8, textAlign: 'center', fontFamily: 'SpaceMono' },
  botaoCarrinho: {
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  textoBotao: { color: '#fff', fontSize: 18, fontWeight: '600', fontFamily: 'SpaceMono' },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  nomeProduto: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    color: '#f59e42',
    textAlign: 'center',
  },
  precoProduto: {
    fontSize: 20,
    color: '#43a047',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  statusProduto: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  caracteristicasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    gap: 6,
  },
  caracteristicaTag: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 2,
  },
  caracteristicaText: {
    fontSize: 12,
    color: '#f59e42',
    fontFamily: 'SpaceMono',
  },
  botaoComprar: {
    marginTop: 12,
    backgroundColor: '#f59e42',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e42',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  textoBotaoComprar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  headerModern: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    height: 56,
    paddingHorizontal: 0,
    paddingTop: 0,
    marginBottom: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
  },
  menuButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 56,
    width: 56,
    marginLeft: 8,
    marginTop: 8,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: drawerWidth,
    backgroundColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 0 },
    elevation: 8,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 9,
  },
  drawerContent: {
    marginTop: 60,
    paddingHorizontal: 24,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f59e42',
    marginBottom: 24,
    fontFamily: 'SpaceMono',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 18,
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
});
