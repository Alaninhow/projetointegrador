import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebaseConfig';
import { createTicket } from '../services/tickets';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

const { width } = Dimensions.get('window');

export default function BuyTicketScreen({ navigation }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const ticketTypes = [
    {
      id: 'adulto',
      name: 'Adulto',
      price: 50,
      description: 'Ingresso padrão para adultos',
      features: ['Acesso ao evento', 'QR Code digital', 'Válido por 24h'],
      icon: 'person',
      color: colors.primary[500],
      popular: false
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 100,
      description: 'Ingresso premium com benefícios exclusivos',
      features: ['Acesso VIP', 'Área exclusiva', 'Brinde especial', 'Válido por 48h'],
      icon: 'star',
      color: colors.warning[500],
      popular: true
    },
    {
      id: 'familia',
      name: 'Família',
      price: 120,
      description: 'Pacote especial para famílias (até 4 pessoas)',
      features: ['Até 4 pessoas', 'Desconto especial', 'Área familiar', 'Válido por 24h'],
      icon: 'people',
      color: colors.accent[500],
      popular: false
    }
  ];

  const handleBuy = async (ticketType) => {
    if (!auth.currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para comprar');
      return;
    }

    setLoading(true);
    try {
      const validUntilMillis = ticketType.id === 'vip' 
        ? Date.now() + (48 * 60 * 60 * 1000) // 48 horas para VIP
        : Date.now() + (24 * 60 * 60 * 1000); // 24 horas para outros

      await createTicket({ 
        ownerUid: auth.currentUser.uid, 
        type: ticketType.name, 
        price: ticketType.price, 
        validUntilMillis 
      });
      
      Alert.alert(
        'Sucesso! 🎉', 
        `Seu ticket ${ticketType.name} foi gerado com sucesso! O QR Code está disponível na sua lista de tickets.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTicketCard = (ticketType) => (
    <TouchableOpacity
      key={ticketType.id}
      style={[
        styles.ticketCard,
        selectedTicket === ticketType.id && styles.selectedCard
      ]}
      onPress={() => setSelectedTicket(ticketType.id)}
    >
      {ticketType.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MAIS POPULAR</Text>
        </View>
      )}
      
      <LinearGradient
        colors={selectedTicket === ticketType.id 
          ? [ticketType.color, `${ticketType.color}80`]
          : ['white', 'white']
        }
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: ticketType.color }]}>
            <Ionicons name={ticketType.icon} size={24} color="white" />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={[
              styles.cardTitle,
              selectedTicket === ticketType.id && styles.selectedText
            ]}>
              {ticketType.name}
            </Text>
            <Text style={[
              styles.cardDescription,
              selectedTicket === ticketType.id && styles.selectedSubtext
            ]}>
              {ticketType.description}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[
            styles.price,
            selectedTicket === ticketType.id && styles.selectedText
          ]}>
            R$ {ticketType.price.toFixed(2)}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {ticketType.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={selectedTicket === ticketType.id ? 'white' : colors.success[500]} 
              />
              <Text style={[
                styles.featureText,
                selectedTicket === ticketType.id && styles.selectedText
              ]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: ticketType.color },
            loading && styles.buyButtonDisabled
          ]}
          onPress={() => handleBuy(ticketType)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="cart" size={20} color="white" />
              <Text style={styles.buyButtonText}>Comprar Agora</Text>
            </>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral[800]} />
      <LinearGradient
        colors={[colors.neutral[800], colors.neutral[700]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Escolha seu Ticket</Text>
            <Text style={styles.subtitle}>Selecione o tipo de ingresso ideal para você</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.ticketsContainer}>
          {ticketTypes.map(renderTicketCard)}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.primary[600]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Informações Importantes</Text>
              <Text style={styles.infoText}>
                • Os tickets são válidos apenas para o evento especificado{'\n'}
                • Apresente o QR Code na entrada{'\n'}
                • Não é possível reembolso após a compra{'\n'}
                • Mantenha seu ticket seguro
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingTop: spacing[16],
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[3],
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: width > 400 ? typography.fontSize['3xl'] : typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width > 400 ? typography.fontSize.base : typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing[1],
    textAlign: 'center',
  },
  helpButton: {
    padding: spacing[2],
    marginLeft: spacing[2],
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    paddingBottom: spacing[20], // Espaço extra para a barra de navegação
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
  },
  ticketsContainer: {
    marginBottom: spacing[6],
  },
  ticketCard: {
    marginBottom: spacing[4],
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.warning[500],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  cardGradient: {
    padding: spacing[5],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },
  selectedText: {
    color: 'white',
  },
  cardDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginTop: spacing[1],
  },
  selectedSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  price: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  featuresContainer: {
    marginBottom: spacing[5],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    marginLeft: spacing[2],
    flex: 1,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyButtonText: {
    color: 'white',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[2],
  },
  infoContainer: {
    marginTop: spacing[4],
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing[4],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing[2],
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    lineHeight: 20,
  },
});
