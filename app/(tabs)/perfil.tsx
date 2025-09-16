import { Drawer } from '@/components/Drawer';
import { Header } from '@/components/Header';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const drawerWidth = SCREEN_WIDTH * 0.7;

// Dados do usuário
const userData = {
  nome: 'Luiz Eduardo',
  email: 'luiz.eduardo@email.com',
  telefone: '(11) 99999-9999',
  endereco: {
    rua: 'Rua Claudia Linda, 60',
    bairro: 'Centro',
    cidade: 'São Paulo',
    cep: '01234-567',
    estado: 'SP'
  },
  avatar: require('@/assets/images/luiz.png'),
  membroDesde: 'Janeiro 2024',
  totalCompras: 12,
  totalGasto: 245.80
};

// Produtos salvos/favoritos
const produtosFavoritos = [
  {
    id: '1',
    nome: 'Tijolo Ecológico',
    preco: 2.50,
    imagem: require('@/assets/images/tijolo.png'),
    categoria: 'Tijolos',
    emPromocao: true
  },
  {
    id: '4',
    nome: 'Vaso Quadrado',
    preco: 12.00,
    imagem: require('@/assets/images/vaso-quadrado.jpg'),
    categoria: 'Decoração',
    emPromocao: true
  },
  {
    id: '2',
    nome: 'Tijolo Quadrado',
    preco: 3.00,
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Tijolos',
    emPromocao: false
  },
  {
    id: '3',
    nome: 'Tijolo Retangular',
    preco: 3.20,
    imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg'),
    categoria: 'Tijolos',
    emPromocao: false
  },
  {
    id: '5',
    nome: 'Vaso Retangular',
    preco: 18.00,
    imagem: require('@/assets/images/vaso-retangular.jpg'),
    categoria: 'Decoração',
    emPromocao: false
  }
];

// Histórico de pedidos
const historicoPedidos = [
  {
    id: '1',
    data: '15/01/2024',
    status: 'Entregue',
    total: 45.50,
    itens: 3,
    numero: '#12345'
  },
  {
    id: '2',
    data: '08/01/2024',
    status: 'Em trânsito',
    total: 32.00,
    itens: 2,
    numero: '#12344'
  },
  {
    id: '3',
    data: '28/12/2023',
    status: 'Entregue',
    total: 67.20,
    itens: 4,
    numero: '#12343'
  }
];

export default function PerfilScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-drawerWidth));
  const [activeTab, setActiveTab] = useState('favoritos');
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [dadosEditaveis, setDadosEditaveis] = useState(userData);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  
  // Animações
  const profileAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const tabsAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  // useEffect para animações iniciais
  useEffect(() => {
    Animated.parallel([
      Animated.timing(profileAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(tabsAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const removerFavorito = () => {
    Alert.alert(
      'Remover Favorito',
      'Tem certeza que deseja remover este item dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive' }
      ]
    );
  };

  const renderFavorito = ({ item }: any) => (
    <View style={styles.favoritoCard}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.favoritoGradient}
      >
        <Image source={item.imagem} style={styles.favoritoImage} />
        <View style={styles.favoritoInfo}>
          <Text style={styles.favoritoCategoria}>{item.categoria}</Text>
          <Text style={styles.favoritoNome} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.favoritoPreco}>R$ {item.preco.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.favoritoButton}
          onPress={removerFavorito}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="heart" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderPedido = ({ item }: any) => (
    <View style={styles.pedidoCard}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.pedidoGradient}
      >
        <View style={styles.pedidoHeader}>
          <View>
            <Text style={styles.pedidoNumero}>{item.numero}</Text>
            <Text style={styles.pedidoData}>{item.data}</Text>
          </View>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'Entregue' ? Colors.primary : Colors.accent
          }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.pedidoInfo}>
          <Text style={styles.pedidoItens}>{item.itens} itens</Text>
          <Text style={styles.pedidoTotal}>R$ {item.total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.pedidoButton} activeOpacity={0.7}>
          <Text style={styles.pedidoButtonText}>Ver Detalhes</Text>
          <MaterialCommunityIcons name="chevron-right" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <Drawer 
        isOpen={drawerOpen} 
        onClose={closeDrawer} 
        drawerAnim={drawerAnim} 
        drawerWidth={drawerWidth} 
      />

      <Header 
        title="Ecological Construction" 
        onMenuPress={openDrawer}
        isMenuOpen={drawerOpen}
        rightButton={{
          icon: editandoPerfil ? 'check' : 'account-edit',
          onPress: () => setEditandoPerfil(!editandoPerfil)
        }}
      />

      <ScrollView 
        ref={scrollRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor="transparent"
          />
        }
      >
        {/* Informações do Usuário */}
        <Animated.View 
          style={[
            styles.profileCard,
            {
              opacity: profileAnim,
              transform: [{
                translateY: profileAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fafc', '#f1f5f9']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <Image source={dadosEditaveis.avatar} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEditButton}>
                <MaterialCommunityIcons name="camera" size={14} color={Colors.text.inverse} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              {editandoPerfil ? (
                <TextInput
                  style={styles.editInput}
                  value={dadosEditaveis.nome}
                  onChangeText={(text) => setDadosEditaveis({...dadosEditaveis, nome: text})}
                  placeholder="Nome completo"
                  placeholderTextColor={Colors.text.tertiary}
                />
              ) : (
                <Text style={styles.userName}>{dadosEditaveis.nome}</Text>
              )}
              
              <Text style={styles.userEmail}>{dadosEditaveis.email}</Text>
              <View style={styles.memberInfo}>
                <MaterialCommunityIcons name="calendar" size={14} color={Colors.text.tertiary} />
                <Text style={styles.memberSince}>Membro desde {dadosEditaveis.membroDesde}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Estatísticas */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: statsAnim,
              transform: [{
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#fef3c7', '#fde68a']}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="shopping" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{dadosEditaveis.totalCompras}</Text>
              <Text style={styles.statLabel}>Compras</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#d1fae5', '#a7f3d0']}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="currency-usd" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>R$ {dadosEditaveis.totalGasto.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Gasto</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#fecaca', '#fca5a5']}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="heart" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{produtosFavoritos.length}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Informações de Contato */}
        <Animated.View 
          style={[
            styles.infoCard,
            {
              opacity: statsAnim,
              transform: [{
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.infoGradient}
          >
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="account" size={20} color={Colors.primary} />
              <Text style={styles.infoTitle}>Informações Pessoais</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="phone" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>{dadosEditaveis.telefone}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="map-marker" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>
                {dadosEditaveis.endereco.rua}, {dadosEditaveis.endereco.bairro}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="map" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>
                {dadosEditaveis.endereco.cidade} - {dadosEditaveis.endereco.estado}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Tabs de Navegação */}
        <Animated.View 
          style={[
            styles.tabsContainer,
            {
              opacity: tabsAnim,
              transform: [{
                translateY: tabsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.tabsGradient}
          >
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'favoritos' && styles.activeTab]}
              onPress={() => setActiveTab('favoritos')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="heart" 
                size={18} 
                color={activeTab === 'favoritos' ? Colors.primary : Colors.text.secondary} 
              />
              <Text style={[styles.tabText, activeTab === 'favoritos' && styles.activeTabText]}>
                Favoritos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'pedidos' && styles.activeTab]}
              onPress={() => setActiveTab('pedidos')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="shopping" 
                size={18} 
                color={activeTab === 'pedidos' ? Colors.primary : Colors.text.secondary} 
              />
              <Text style={[styles.tabText, activeTab === 'pedidos' && styles.activeTabText]}>
                Pedidos
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Conteúdo das Tabs */}
        <Animated.View 
          style={[
            styles.tabContent,
            {
              opacity: contentAnim,
              transform: [{
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          {activeTab === 'favoritos' ? (
            <>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="heart" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Produtos Favoritos</Text>
              </View>
              <FlatList
                data={produtosFavoritos}
                renderItem={renderFavorito}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.favoritosList}
              />
            </>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="shopping" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Histórico de Pedidos</Text>
              </View>
              <FlatList
                data={historicoPedidos}
                renderItem={renderPedido}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pedidosList}
              />
            </>
          )}
        </Animated.View>

        {/* Configurações */}
        <Animated.View 
          style={[
            styles.settingsCard,
            {
              opacity: contentAnim,
              transform: [{
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.settingsGradient}
          >
            <View style={styles.settingsHeader}>
              <MaterialCommunityIcons name="cog" size={20} color={Colors.primary} />
              <Text style={styles.settingsTitle}>Configurações</Text>
            </View>
            
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <MaterialCommunityIcons name="bell" size={18} color={Colors.text.secondary} />
              <Text style={styles.settingText}>Notificações</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <MaterialCommunityIcons name="lock" size={18} color={Colors.text.secondary} />
              <Text style={styles.settingText}>Privacidade</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <MaterialCommunityIcons name="help-circle" size={18} color={Colors.text.secondary} />
              <Text style={styles.settingText}>Ajuda</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <MaterialCommunityIcons name="logout" size={18} color={Colors.primary} />
              <Text style={[styles.settingText, { color: Colors.primary }]}>Sair</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  headerContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 20,
  },
  headerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  profileCard: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.medium,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.xs,
  },
  editInput: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    textAlign: 'center',
    paddingVertical: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.xs,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  memberSince: {
    fontSize: Typography.sizes.md,
    color: Colors.text.tertiary,
    fontFamily: Typography.fontFamily,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  statGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  infoCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: Spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  infoTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  infoText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  tabsGradient: {
    flexDirection: 'row',
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  activeTab: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  tabContent: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  favoritosList: {
    gap: Spacing.md,
  },
  favoritoCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.sm,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  favoritoGradient: {
    padding: Spacing.md,
  },
  favoritoImage: {
    width: '100%',
    height: 80,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
    marginBottom: Spacing.sm,
  },
  favoritoInfo: {
    flex: 1,
  },
  favoritoCategoria: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: Typography.weights.semibold,
  },
  favoritoNome: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  favoritoPreco: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
  },
  favoritoButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  pedidosList: {
    gap: Spacing.md,
  },
  pedidoCard: {
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  pedidoGradient: {
    padding: Spacing.lg,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  pedidoNumero: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  pedidoData: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.inverse,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.semibold,
  },
  pedidoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pedidoItens: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  pedidoTotal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
  },
  pedidoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  pedidoButtonText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  settingsCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: 100,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  settingsGradient: {
    padding: Spacing.lg,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  settingsTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: drawerWidth,
    backgroundColor: Colors.surface,
    zIndex: 10,
    ...Shadows.medium,
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
    marginTop: 100,
    paddingHorizontal: Spacing.xl,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  drawerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  drawerUserInfo: {
    flex: 1,
  },
  drawerUserName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  drawerUserEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
  drawerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.lg,
    fontFamily: Typography.fontFamily,
  },
  drawerSectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  drawerItemText: {
    marginLeft: Spacing.lg,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
});
