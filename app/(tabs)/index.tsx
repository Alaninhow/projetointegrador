import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const drawerWidth = SCREEN_WIDTH * 0.7;

const produtos = [
  {
    nome: 'Tijolo Ecológico',
    preco: 'R$ 2,50',
    imagem: require('@/assets/images/tijolo.png'),
    categoria: 'Tijolos',
  },
  {
    nome: 'Tijolo Quadrado',
    preco: 'R$ 3,00',
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Tijolos',
  },
  {
    nome: 'Tijolo Retangular',
    preco: 'R$ 3,20',
    imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg'),
    categoria: 'Tijolos',
  },
  {
    nome: 'Tijolo Quadrado Premium',
    preco: 'R$ 4,00',
    imagem: require('@/assets/images/tijolo-ilus-quadrado.webp'),
    categoria: 'Tijolos',
  },
  {
    nome: 'Tijolo Quadrado Extra',
    preco: 'R$ 4,50',
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Tijolos',
  },
  {
    nome: 'Vaso Quadrado',
    preco: 'R$ 12,00',
    imagem: require('@/assets/images/vaso-quadrado.jpg'),
    categoria: 'Vasos',
  },
  {
    nome: 'Vaso Quadrado Decorado',
    preco: 'R$ 15,00',
    imagem: require('@/assets/images/vaso-quadrado2.jpg'),
    categoria: 'Vasos',
  },
  {
    nome: 'Vaso Retangular',
    preco: 'R$ 18,00',
    imagem: require('@/assets/images/vaso-retangular.jpg'),
    categoria: 'Vasos',
  },
  // Ofertas especiais
  {
    nome: 'Oferta Relâmpago: Tijolo Quadrado',
    preco: 'R$ 2,40',
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Ofertas',
  },
  {
    nome: 'Promoção: Vaso Decorado',
    preco: 'R$ 12,00',
    imagem: require('@/assets/images/vaso-quadrado2.jpg'),
    categoria: 'Ofertas',
  },
  // Eco
  {
    nome: 'Tijolo Reciclado',
    preco: 'R$ 2,80',
    imagem: require('@/assets/images/tijolo-ilus-quadrado.webp'),
    categoria: 'Eco',
  },
  {
    nome: 'Vaso Sustentável',
    preco: 'R$ 13,00',
    imagem: require('@/assets/images/vaso-quadrado.jpg'),
    categoria: 'Eco',
  },
  // Entrega
  {
    nome: 'Entrega Expressa',
    preco: 'Consultar',
    imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg'),
    categoria: 'Entrega',
  },
  // Parceiros
  {
    nome: 'Tijolo Artístico (Parceiro)',
    preco: 'R$ 6,00',
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Parceiros',
  },
  {
    nome: 'Vaso Artístico (Parceiro)',
    preco: 'R$ 20,00',
    imagem: require('@/assets/images/vaso-quadrado2.jpg'),
    categoria: 'Parceiros',
  },
];

const beneficios = [
  { icon: 'leaf', label: 'Sustentável' },
  { icon: 'shield-check', label: 'Resistente' },
  { icon: 'truck-fast', label: 'Entrega Rápida' },
  { icon: 'recycle', label: 'Reciclado' },
];

const banners = [
  require('@/assets/images/vaso-retangular.jpg'),
  require('@/assets/images/tijolo-ilus-retangulo.jpg'),
  require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
];

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-drawerWidth));
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerScrollRef = useRef(null);
  const router = useRouter();

  // Autoplay do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        if (bannerScrollRef.current) {
          bannerScrollRef.current.scrollTo({
            x: next * (SCREEN_WIDTH - 48 + 16), // largura do card + marginHorizontal
            animated: true,
          });
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Função para atualizar o índice do banner ao rolar
  const onScrollBanner = (event) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setBannerIndex(page);
  };

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

  return (
    <LinearGradient
      colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
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
        {/* Header com menu e busca juntos, sem gradiente */}
        <View style={styles.headerGradient}>
          <View style={styles.headerSearchRow}>
            <TouchableOpacity
              onPress={openDrawer}
              style={styles.menuButtonCompact}
              activeOpacity={0.7}
            >
              <FontAwesome name="bars" size={26} color="#f59e42" />
            </TouchableOpacity>
            <View style={styles.searchBarContainerCompact}>
              <FontAwesome name="search" size={18} color="#f59e42" style={{ marginLeft: 10 }} />
              <Text style={styles.searchBarTextCompact}>Pesquisar</Text>
              <TouchableOpacity style={styles.micButton}>
                <MaterialIcons name="mic" size={20} color="#f59e42" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ScrollView principal vertical */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Carrossel de banners */}
          <View style={styles.sectionContainer}>
            <View style={styles.carouselContainer}>
              <ScrollView
                ref={bannerScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScrollBanner}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                snapToAlignment="center"
                decelerationRate="fast"
              >
                {banners.map((img, idx) => (
                  <View key={idx} style={styles.carouselCard}>
                    <Image source={img} style={styles.carouselImage} />
                    <View style={styles.carouselOverlay} />
                  </View>
                ))}
              </ScrollView>
              {/* Dots de paginação */}
              <View style={styles.carouselDots}>
                {banners.map((_, idx) => (
                  <View
                    key={idx}
                    style={[styles.carouselDot, bannerIndex === idx && styles.carouselDotActive]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Categorias em destaque */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="category" size={24} color="#f59e42" />
              <Text style={styles.sectionTitle}>Categorias</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasContainer} contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 4}}>
              <View style={styles.categoriaItem}>
                <MaterialCommunityIcons name="cube-outline" size={28} color="#f59e42" />
                <Text style={styles.categoriaLabel}>Tijolos</Text>
              </View>
              <View style={styles.categoriaItem}>
                <MaterialCommunityIcons name="flower-outline" size={28} color="#43a047" />
                <Text style={styles.categoriaLabel}>Vasos</Text>
              </View>
              <View style={styles.categoriaItem}>
                <MaterialCommunityIcons name="star-outline" size={28} color="#f59e42" />
                <Text style={styles.categoriaLabel}>Ofertas</Text>
              </View>
              <View style={styles.categoriaItem}>
                <MaterialCommunityIcons name="leaf" size={28} color="#43a047" />
                <Text style={styles.categoriaLabel}>Eco</Text>
              </View>
              <View style={styles.categoriaItem}>
                <MaterialCommunityIcons name="truck-fast-outline" size={28} color="#f59e42" />
                <Text style={styles.categoriaLabel}>Entrega</Text>
              </View>
              <View style={styles.categoriaItem}>
                <MaterialCommunityIcons name="account-group-outline" size={28} color="#f59e42" />
                <Text style={styles.categoriaLabel}>Parceiros</Text>
              </View>
            </ScrollView>
          </View>

          {/* Carrossel de Ofertas/Promoções */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="local-offer" size={24} color="#f59e42" />
              <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ofertasCarousel} contentContainerStyle={{paddingHorizontal: 16}}>
              <View style={styles.ofertaCard}>
                <Image source={require('@/assets/images/tijolo-ilus-quadrado2.jpg')} style={styles.ofertaImage} />
                <Text style={styles.ofertaTitulo}>Oferta Relâmpago</Text>
                <Text style={styles.ofertaDescricao}>Tijolo Quadrado com 20% OFF</Text>
              </View>
              <View style={styles.ofertaCard}>
                <Image source={require('@/assets/images/vaso-quadrado2.jpg')} style={styles.ofertaImage} />
                <Text style={styles.ofertaTitulo}>Promoção</Text>
                <Text style={styles.ofertaDescricao}>Vaso Decorado por R$ 12,00</Text>
              </View>
              <View style={styles.ofertaCard}>
                <Image source={require('@/assets/images/tijolo-ilus-retangulo.jpg')} style={styles.ofertaImage} />
                <Text style={styles.ofertaTitulo}>Frete Grátis</Text>
                <Text style={styles.ofertaDescricao}>Em compras acima de R$ 100</Text>
              </View>
            </ScrollView>
          </View>

          {/* Seção de informações importantes */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={24} color="#f59e42" />
              <Text style={styles.sectionTitle}>Por que escolher a gente?</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Compre direto da fábrica, com garantia de qualidade e entrega rápida!</Text>
              <View style={styles.infoHighlights}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="local-shipping" size={28} color="#f59e42" />
                  <Text style={styles.infoLabel}>Entrega em todo o Brasil</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialIcons name="credit-card" size={28} color="#f59e42" />
                  <Text style={styles.infoLabel}>Pagamento facilitado</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="certificate" size={28} color="#f59e42" />
                  <Text style={styles.infoLabel}>Produtos certificados</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="whatsapp" size={24} color="#25D366" />
                <Text style={styles.infoContact}>Dúvidas? Fale no WhatsApp: (47) 9 1276-3398</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="leaf" size={24} color="#43a047" />
                <Text style={styles.infoEco}>Produto sustentável e amigo do meio ambiente</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="star" size={24} color="#f59e42" />
                <Text style={styles.infoReview}>Mais de 500 clientes satisfeitos!</Text>
              </View>
            </View>
          </View>

          {/* Produtos em destaque */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="star" size={24} color="#f59e42" />
              <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.produtosScroll}>
              {produtos.map((p, i) => (
                <View key={i} style={styles.cardProduto}>
                  <Image source={p.imagem} style={styles.imagemProduto} />
                  <Text style={styles.nomeProduto}>{p.nome}</Text>
                  <Text style={styles.precoProduto}>{p.preco}</Text>
                  <TouchableOpacity style={styles.botaoComprar}>
                    <Text style={styles.textoBotaoComprar}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Produtos recomendados */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="recommend" size={24} color="#f59e42" />
              <Text style={styles.sectionTitle}>Recomendados para Você</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.produtosScroll}>
              {produtos.map((p, i) => (
                <View key={i} style={styles.cardProduto}>
                  <Image source={p.imagem} style={styles.imagemProduto} />
                  <Text style={styles.nomeProduto}>{p.nome}</Text>
                  <Text style={styles.precoProduto}>{p.preco}</Text>
                  {/* Avaliação rápida */}
                  <View style={styles.ratingRow}>
                    {[1,2,3,4,5].map((star) => (
                      <FontAwesome key={star} name="star" size={14} color={star <= 4 ? '#f59e42' : '#ccc'} />
                    ))}
                    <Text style={styles.ratingText}>(120)</Text>
                  </View>
                  <TouchableOpacity style={styles.botaoComprar}>
                    <Text style={styles.textoBotaoComprar}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Como comprar e Por que comprar conosco */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="help" size={24} color="#f59e42" />
              <Text style={styles.sectionTitle}>Como Comprar</Text>
            </View>
            <View style={styles.extraInfoSection}>
              <Text style={styles.extraInfoTitle}>Como comprar?</Text>
              <View style={styles.extraInfoSteps}>
                <View style={styles.extraInfoStep}>
                  <MaterialIcons name="search" size={24} color="#f59e42" />
                  <Text style={styles.extraInfoStepText}>Escolha o produto</Text>
                </View>
                <View style={styles.extraInfoStep}>
                  <MaterialIcons name="shopping-cart" size={24} color="#f59e42" />
                  <Text style={styles.extraInfoStepText}>Adicione ao carrinho</Text>
                </View>
                <View style={styles.extraInfoStep}>
                  <MaterialIcons name="payment" size={24} color="#f59e42" />
                  <Text style={styles.extraInfoStepText}>Finalize a compra</Text>
                </View>
                <View style={styles.extraInfoStep}>
                  <MaterialIcons name="local-shipping" size={24} color="#f59e42" />
                  <Text style={styles.extraInfoStepText}>Receba em casa</Text>
                </View>
              </View>
              <Text style={styles.extraInfoSubtitle}>Por que comprar conosco?</Text>
              <LinearGradient
                colors={['#fff7ed', '#ffe0b2', '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.whyUsCard}
              >
                <View style={styles.whyUsGrid}>
                  <View style={styles.whyUsItem}>
                    <MaterialIcons name="support-agent" size={32} color="#f59e42" style={styles.whyUsIcon} />
                    <Text style={styles.whyUsText}>Atendimento{"\n"}personalizado</Text>
                  </View>
                  <View style={styles.whyUsItem}>
                    <MaterialIcons name="verified" size={32} color="#43a047" style={styles.whyUsIcon} />
                    <Text style={styles.whyUsText}>Entrega{"\n"}garantida</Text>
                  </View>
                  <View style={styles.whyUsItem}>
                    <MaterialIcons name="engineering" size={32} color="#f59e42" style={styles.whyUsIcon} />
                    <Text style={styles.whyUsText}>Equipe{"\n"}especializada</Text>
                  </View>
                  <View style={styles.whyUsItem}>
                    <MaterialIcons name="security" size={32} color="#f59e42" style={styles.whyUsIcon} />
                    <Text style={styles.whyUsText}>Garantia{"\n"}12 meses</Text>
                  </View>
                  <View style={styles.whyUsItem}>
                    <MaterialIcons name="whatsapp" size={32} color="#25D366" style={styles.whyUsIcon} />
                    <Text style={styles.whyUsText}>Suporte{"\n"}WhatsApp</Text>
                  </View>
                </View>
              </LinearGradient>
              <Text style={styles.extraInfoCta}>Ficou com dúvida? <Text style={{color:'#f59e42', fontWeight:'bold'}}>Fale com a gente!</Text></Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 56,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
  },
  headerTitleModern: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.5,
    textShadowColor: '#0005',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: drawerWidth,
    backgroundColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    elevation: 6,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
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
  headerImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  banner: {
    margin: 24,
    borderRadius: 22,
    overflow: 'hidden',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  bannerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0007',
  },
  bannerContent: {
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'SpaceMono',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#0008',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
    textShadowColor: '#0007',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  bannerButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.5,
  },
  beneficiosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 32,
    marginTop: 12,
  },
  beneficioItem: {
    backgroundColor: '#f59e42',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  beneficioLabel: {
    fontSize: 14,
    color: '#f59e42',
    fontFamily: 'SpaceMono',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'SpaceMono',
    marginLeft: 24,
    marginBottom: 12,
    marginTop: 8,
  },
  produtosScroll: {
    paddingLeft: 16,
    marginBottom: 32,
  },
  cardProduto: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginRight: 18,
    alignItems: 'center',
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    transform: [{ scale: 1 }],
    marginBottom: 10, // novo espaçamento
  },
  imagemProduto: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
  },
  nomeProduto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
    textAlign: 'center',
  },
  precoProduto: {
    fontSize: 15,
    color: '#f59e42',
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'SpaceMono',
  },
  botaoComprar: {
    backgroundColor: '#f59e42',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 4,
  },
  textoBotaoComprar: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  content: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselContainer: {
    width: '100%',
    height: 180,
    marginTop: 10,
    marginBottom: 18,
  },
  carouselCard: {
    width: SCREEN_WIDTH - 48,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 18,
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 18,
  },
  carouselDots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 6,
    transitionProperty: 'background-color, width, height',
    transitionDuration: '200ms',
  },
  carouselDotActive: {
    backgroundColor: '#f59e42',
    width: 20,
    height: 12,
    borderRadius: 6,
  },
  produtosSection: {
    marginTop: 10,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e42',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
    maxWidth: 320,
    alignSelf: 'center',
  },
  infoHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    flexWrap: 'wrap',
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
    width: 90,
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'SpaceMono',
    maxWidth: 90,
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
    maxWidth: 320,
    alignSelf: 'center',
  },
  infoContact: {
    fontSize: 13,
    color: '#1f2937',
    marginLeft: 8,
    fontFamily: 'SpaceMono',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  infoEco: {
    fontSize: 13,
    color: '#43a047',
    marginLeft: 8,
    fontFamily: 'SpaceMono',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  infoReview: {
    fontSize: 13,
    color: '#f59e42',
    marginLeft: 8,
    fontFamily: 'SpaceMono',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  extraInfoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  extraInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e42',
    marginBottom: 10,
    fontFamily: 'SpaceMono',
  },
  extraInfoSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  extraInfoStep: {
    alignItems: 'center',
    width: 80,
    marginBottom: 8,
  },
  extraInfoStepText: {
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'SpaceMono',
  },
  extraInfoSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e42',
    marginTop: 10,
    marginBottom: 6,
    fontFamily: 'SpaceMono',
  },
  extraInfoHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  extraInfoHighlight: {
    alignItems: 'center',
    width: 110,
    marginBottom: 6,
  },
  extraInfoHighlightText: {
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'SpaceMono',
  },
  extraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  extraInfoRowText: {
    fontSize: 12,
    color: '#1f2937',
    marginLeft: 8,
    fontFamily: 'SpaceMono',
  },
  extraInfoCta: {
    fontSize: 13,
    color: '#1f2937',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchBarText: {
    color: '#888',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'SpaceMono',
  },
  categoriasContainer: {
    marginTop: 2,
    marginBottom: 10,
    minHeight: 80,
  },
  categoriaItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    width: 70,
    height: 70,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoriaLabel: {
    fontSize: 13,
    color: '#1f2937',
    marginTop: 4,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  ofertasCarousel: {
    marginTop: 4,
    marginBottom: 12,
    minHeight: 140,
  },
  ofertaCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginRight: 16,
    alignItems: 'center',
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ofertaImage: {
    width: 120,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 8,
  },
  ofertaTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f59e42',
    fontFamily: 'SpaceMono',
    marginBottom: 2,
  },
  ofertaDescricao: {
    fontSize: 13,
    color: '#1f2937',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  recomendadosSection: {
    marginTop: 18,
    marginBottom: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
    fontFamily: 'SpaceMono',
  },
  headerSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  menuButtonCompact: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchBarContainerCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 44,
    paddingRight: 8,
  },
  searchBarTextCompact: {
    color: '#f59e42',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'SpaceMono',
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.2,
    flex: 1,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f59e42',
  },
  headerGradient: {
    paddingTop: 28,
    paddingBottom: 10,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#fff',
    position: 'relative',
  },
  whyUsCard: {
    borderRadius: 24,
    padding: 18,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  whyUsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  whyUsItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 12,
  },
  whyUsIcon: {
    marginBottom: 6,
  },
  whyUsText: {
    color: '#1f2937',
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'SpaceMono',
    marginLeft: 8,
  },
  searchInput: {
    color: '#f59e42',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'SpaceMono',
    fontWeight: '500',
    letterSpacing: 0.2,
    flex: 1,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchInputHidden: {
    position: 'absolute',
    left: 40,
    right: 60,
    height: 44,
    color: '#f59e42',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: '500',
    letterSpacing: 0.2,
    zIndex: 1,
  },
  clearButtonHidden: {
    position: 'absolute',
    right: 50,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

