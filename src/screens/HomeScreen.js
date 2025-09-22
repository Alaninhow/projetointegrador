import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';
import { screenData, getResponsiveSpacing } from '../utils/responsive';
import ResponsiveCard from '../components/ResponsiveCard';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [ticketsCount, setTicketsCount] = useState(0);
  const [validTicketsCount, setValidTicketsCount] = useState(0);
  const [userName, setUserName] = useState('');
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!auth?.currentUser || !db) return;

    // Buscar nome do usuário
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().nome || auth.currentUser.email?.split('@')[0] || 'Usuário');
        } else {
          setUserName(auth.currentUser.email?.split('@')[0] || 'Usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        setUserName(auth.currentUser.email?.split('@')[0] || 'Usuário');
      }
    };

    fetchUserName();

    const q = query(
      collection(db, 'tickets'),
      where('ownerUid', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTicketsCount(ticketsData.length);
      
      // Contar tickets válidos
      const validTickets = ticketsData.filter(ticket => {
        const now = Date.now();
        return ticket.validUntilMillis > now && !ticket.used;
      });
      setValidTicketsCount(validTickets.length);
    }, (error) => {
      console.error('Erro ao carregar tickets:', error);
    });

    return () => unsubscribe();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const displayName = userName || (auth?.currentUser?.email?.split('@')[0]) || 'Usuário';
    
    if (hour < 12) return `Bom dia, ${displayName}`;
    if (hour < 18) return `Boa tarde, ${displayName}`;
    return `Boa noite, ${displayName}`;
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral[900]} />
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary[600], colors.primary[700], colors.primary[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Modern Background Pattern */}
          <View style={styles.patternOverlay}>
            <View style={styles.modernPattern1} />
            <View style={styles.modernPattern2} />
            <View style={styles.modernPattern3} />
            <View style={styles.modernPattern4} />
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <View style={styles.greetingHeader}>
                <Text style={[styles.greeting, { fontSize: width > 400 ? typography.fontSize['3xl'] : typography.fontSize['2xl'] }]}>
                  {getGreeting()}
                </Text>
                <View style={styles.emailContainer}>
                  <Ionicons name="mail" size={16} color="rgba(255, 255, 255, 0.7)" style={styles.emailIcon} />
                  <Text style={[styles.userName, { fontSize: width > 400 ? typography.fontSize.base : typography.fontSize.sm }]}>
                    {auth?.currentUser?.email || 'Usuário'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="white" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('Conta')}
              >
                <View style={styles.avatarContainer}>
                  <Ionicons name="person" size={18} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cards de Estatísticas */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <ResponsiveCard style={styles.statCard}>
            <Ionicons 
              name="ticket" 
              size={screenData.isTablet ? 40 : 32} 
              color={colors.primary[600]} 
            />
            <Text style={styles.statNumber}>{ticketsCount}</Text>
            <Text style={styles.statLabel}>Total de Tickets</Text>
          </ResponsiveCard>
          <ResponsiveCard style={styles.statCard}>
            <Ionicons 
              name="checkmark-circle" 
              size={screenData.isTablet ? 40 : 32} 
              color={colors.accent[600]} 
            />
            <Text style={styles.statNumber}>{validTicketsCount}</Text>
            <Text style={styles.statLabel}>Tickets Válidos</Text>
          </ResponsiveCard>
        </Animated.View>

        {/* Ações Principais */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>O que você gostaria de fazer?</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('BuyTicket')}
          >
            <LinearGradient
              colors={[colors.primary[500], colors.primary[600]]}
              style={styles.actionGradient}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="cart" size={32} color="white" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Comprar Tickets</Text>
                  <Text style={styles.actionSubtitle}>Adquira ingressos para eventos</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Tickets')}
          >
            <LinearGradient
              colors={[colors.accent[500], colors.accent[600]]}
              style={styles.actionGradient}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="ticket" size={32} color="white" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Ver Meus Tickets</Text>
                  <Text style={styles.actionSubtitle}>Gerencie seus ingressos</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recursos Rápidos */}
        <Animated.View 
          style={[
            styles.quickActionsContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Recursos Rápidos</Text>
          
          <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('QRCode', { ticket: { id: 'demo', type: 'Demo' } })}
          >
            <Ionicons name="qr-code" size={24} color={colors.secondary[600]} />
            <Text style={styles.quickActionText}>QR Code</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Conta')}
          >
            <Ionicons name="settings" size={24} color={colors.accent[600]} />
            <Text style={styles.quickActionText}>Configurações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
          >
            <Ionicons name="help-circle" size={24} color={colors.warning[600]} />
            <Text style={styles.quickActionText}>Ajuda</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
          >
            <Ionicons name="information-circle" size={24} color={colors.neutral[600]} />
            <Text style={styles.quickActionText}>Sobre</Text>
          </TouchableOpacity>
        </View>
        </Animated.View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: spacing[12],
    paddingBottom: spacing[4],
    paddingHorizontal: 0,
    position: 'relative',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  modernPattern1: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ rotate: '45deg' }],
  },
  modernPattern2: {
    position: 'absolute',
    bottom: -20,
    left: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  modernPattern3: {
    position: 'absolute',
    top: '40%',
    left: '70%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modernPattern4: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    transform: [{ rotate: '30deg' }],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: spacing[4],
  },
  greetingHeader: {
    alignItems: 'flex-start',
    width: '100%',
  },
  greeting: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: 'white',
    marginBottom: spacing[2],
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emailIcon: {
    marginRight: spacing[2],
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  subtitleContainer: {
    marginTop: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[1],
  },
  subtitleSecondary: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  notificationButton: {
    padding: spacing[3],
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent[500],
    borderWidth: 2,
    borderColor: 'white',
  },
  profileButton: {
    padding: spacing[1],
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginTop: 140, // Altura do header fixo
  },
  scrollContent: {
    paddingHorizontal: getResponsiveSpacing(spacing[6]),
    paddingTop: getResponsiveSpacing(spacing[6]),
    paddingBottom: getResponsiveSpacing(spacing[20]), // Espaço extra para a barra de navegação
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
    paddingHorizontal: spacing[2],
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing[1],
    minHeight: screenData.isTablet ? 140 : screenData.isLargeDevice ? 120 : 100,
  },
  statNumber: {
    fontSize: screenData.isTablet ? typography.fontSize['4xl'] : typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    marginTop: spacing[2],
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginTop: spacing[1],
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing[6],
  },
  actionCard: {
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
  actionGradient: {
    padding: spacing[5],
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: 'white',
    marginBottom: spacing[1],
  },
  actionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActionsContainer: {
    marginBottom: spacing[6],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: screenData.isTablet ? spacing[5] : spacing[4],
    alignItems: 'center',
    width: (width - getResponsiveSpacing(spacing[6]) * 2 - spacing[3]) / 2,
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: screenData.isTablet ? 110 : screenData.isLargeDevice ? 90 : 80,
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    marginTop: spacing[2],
    textAlign: 'center',
  },
});
