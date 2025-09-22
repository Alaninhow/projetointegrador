import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

const { width } = Dimensions.get('window');

export default function TicketsScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Usar uma consulta mais simples que não requer índice composto
    const q = query(
      collection(db, 'tickets'),
      where('ownerUid', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar localmente por data de criação
      ticketsData.sort((a, b) => {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;
        return dateB - dateA; // Ordem decrescente (mais recente primeiro)
      });
      
      setTickets(ticketsData);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar tickets:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // O onSnapshot já atualiza automaticamente
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getTicketStatus = (ticket) => {
    const now = Date.now();
    if (ticket.validUntilMillis < now) {
      return { status: 'Expirado', color: colors.error[500], icon: 'time-outline' };
    }
    if (ticket.used) {
      return { status: 'Usado', color: colors.warning[500], icon: 'checkmark-circle-outline' };
    }
    return { status: 'Válido', color: colors.success[500], icon: 'checkmark-circle' };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTicket = ({ item }) => {
    const ticketStatus = getTicketStatus(item);
    
    return (
      <TouchableOpacity style={styles.ticketCard}>
        <LinearGradient
          colors={[colors.primary[50], colors.accent[50]]}
          style={styles.ticketGradient}
        >
          <View style={styles.ticketHeader}>
            <View style={styles.ticketTypeContainer}>
              <Ionicons 
                name={item.type === 'VIP' ? 'star' : item.type === 'Família' ? 'people' : 'person'} 
                size={24} 
                color={item.type === 'VIP' ? colors.warning[500] : item.type === 'Família' ? colors.accent[500] : colors.primary[600]} 
              />
              <Text style={styles.ticketType}>{item.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: ticketStatus.color }]}>
              <Ionicons name={ticketStatus.icon} size={16} color="white" />
              <Text style={styles.statusText}>{ticketStatus.status}</Text>
            </View>
          </View>
          
          <View style={styles.ticketContent}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketLabel}>Criado em:</Text>
              <Text style={styles.ticketValue}>{formatDate(item.createdAt)}</Text>
            </View>
            
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketLabel}>Válido até:</Text>
              <Text style={styles.ticketValue}>{formatDate(item.validUntilMillis)}</Text>
            </View>
            
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketLabel}>Preço:</Text>
              <Text style={styles.ticketPrice}>R$ {item.price?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
          
          <View style={styles.ticketActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('QRCode', { ticket: item })}
            >
              <Ionicons name="qr-code-outline" size={20} color={colors.primary[600]} />
              <Text style={styles.actionText}>Ver QR Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={colors.primary[600]} />
              <Text style={styles.actionText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.primary[500], colors.secondary[500]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Meus Tickets</Text>
            <Text style={styles.subtitle}>Gerencie seus ingressos</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('BuyTicket')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tickets.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tickets.filter(t => getTicketStatus(t).status === 'Válido').length}
            </Text>
            <Text style={styles.statLabel}>Válidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tickets.filter(t => t.type === 'VIP').length}
            </Text>
            <Text style={styles.statLabel}>VIP</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando tickets...</Text>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={80} color={colors.neutral[300]} />
            <Text style={styles.emptyTitle}>Nenhum ticket encontrado</Text>
            <Text style={styles.emptySubtitle}>Compre seu primeiro ticket para começar!</Text>
            <TouchableOpacity 
              style={styles.buyFirstButton}
              onPress={() => navigation.navigate('BuyTicket')}
            >
              <Text style={styles.buyFirstButtonText}>Comprar Primeiro Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={renderTicket}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary[500]]}
                tintColor={colors.primary[500]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingTop: spacing[12],
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[6],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: 'white',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing[1],
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing[4],
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing[1],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginTop: spacing[1],
  },
  listContainer: {
    paddingBottom: spacing[20], // Espaço extra para a barra de navegação
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
  ticketGradient: {
    padding: spacing[5],
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  ticketTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketType: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginLeft: spacing[2],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing[1],
  },
  ticketContent: {
    marginBottom: spacing[4],
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  ticketLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
  },
  ticketValue: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[900],
    fontWeight: typography.fontWeight.medium,
  },
  ticketPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.success[600],
    fontWeight: typography.fontWeight.semibold,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: spacing[4],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing[1],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    marginTop: spacing[4],
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    textAlign: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  buyFirstButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: 12,
  },
  buyFirstButtonText: {
    color: 'white',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
