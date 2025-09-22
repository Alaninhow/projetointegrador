import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import QRCode from 'react-native-qrcode-svg';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

const { width, height } = Dimensions.get('window');

export default function QRCodeScreen({ route, navigation }) {
  const { ticket } = route.params;
  const [qrSize] = useState(Math.min(width * 0.6, 250));

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Meu ticket ${ticket.type} - TicketApp\nCódigo: ${ticket.id}`,
        title: 'Compartilhar Ticket',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o ticket');
    }
  };

  const getTicketStatus = () => {
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

  const ticketStatus = getTicketStatus();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[500]} />
      
      <LinearGradient
        colors={[colors.primary[500], colors.secondary[500]]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={qrSize * 0.6} color={colors.primary[600]} />
              <Text style={styles.qrText}>QR Code</Text>
              <Text style={styles.qrId}>{ticket.id}</Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: ticketStatus.color }]}>
              <Ionicons name={ticketStatus.icon} size={20} color="white" />
              <Text style={styles.statusText}>{ticketStatus.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ticketInfo}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons 
                name={ticket.type === 'VIP' ? 'star' : 'person'} 
                size={24} 
                color={ticket.type === 'VIP' ? colors.warning[500] : colors.primary[600]} 
              />
              <Text style={styles.ticketType}>{ticket.type}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID do Ticket:</Text>
              <Text style={styles.infoValue}>{ticket.id}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Criado em:</Text>
              <Text style={styles.infoValue}>{formatDate(ticket.createdAt)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Válido até:</Text>
              <Text style={styles.infoValue}>{formatDate(ticket.validUntilMillis)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Preço:</Text>
              <Text style={styles.infoPrice}>R$ {ticket.price?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Como usar:</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="1" size={20} color={colors.primary[600]} />
            <Text style={styles.instructionText}>Apresente este QR Code na entrada do evento</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="2" size={20} color={colors.primary[600]} />
            <Text style={styles.instructionText}>Mantenha a tela bem iluminada</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="3" size={20} color={colors.primary[600]} />
            <Text style={styles.instructionText}>Não compartilhe com outras pessoas</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[12],
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[6],
  },
  backButton: {
    padding: spacing[2],
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: 'white',
  },
  shareButton: {
    padding: spacing[2],
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  qrWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing[6],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: spacing[4],
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  qrText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    marginTop: spacing[2],
  },
  qrId: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing[1],
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[2],
  },
  ticketInfo: {
    marginBottom: spacing[6],
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing[5],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  ticketType: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginLeft: spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[900],
    fontWeight: typography.fontWeight.medium,
    flex: 1,
    textAlign: 'right',
  },
  infoPrice: {
    fontSize: typography.fontSize.base,
    color: colors.success[600],
    fontWeight: typography.fontWeight.semibold,
  },
  instructions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing[5],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing[4],
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  instructionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[700],
    marginLeft: spacing[3],
    flex: 1,
  },
});
