// src/services/tickets.js
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/**
 * Cria um novo ticket no Firestore
 */
export async function createTicket({ ownerUid, type, price, validUntilMillis }) {
  try {
    const ticketData = {
      ownerUid,
      type,
      price,
      validUntilMillis,
      createdAt: Date.now(),
      used: false,
      qrCode: generateQRCodeData(ownerUid, type, price)
    };

    const docRef = await addDoc(collection(db, 'tickets'), ticketData);
    
    return {
      ticketId: docRef.id,
      qrUrl: `data:image/svg+xml;base64,${btoa(generateQRCodeSVG(ticketData.qrCode))}`,
      ...ticketData
    };
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw new Error('Falha ao criar ticket');
  }
}

/**
 * Busca todos os tickets de um usuário
 */
export async function getUserTickets(ownerUid) {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('ownerUid', '==', ownerUid)
    );
    
    const querySnapshot = await getDocs(q);
    const tickets = [];
    
    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Ordenar por data de criação (mais recente primeiro)
    tickets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    return tickets;
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    throw new Error('Falha ao buscar tickets');
  }
}

/**
 * Marca um ticket como usado
 */
export async function markTicketAsUsed(ticketId) {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      used: true,
      usedAt: Date.now()
    });
  } catch (error) {
    console.error('Erro ao marcar ticket como usado:', error);
    throw new Error('Falha ao marcar ticket como usado');
  }
}

/**
 * Deleta um ticket
 */
export async function deleteTicket(ticketId) {
  try {
    await deleteDoc(doc(db, 'tickets', ticketId));
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    throw new Error('Falha ao deletar ticket');
  }
}

/**
 * Gera dados para o QR Code
 */
function generateQRCodeData(ownerUid, type, price) {
  return JSON.stringify({
    ticketId: `${ownerUid}_${Date.now()}`,
    type,
    price,
    timestamp: Date.now()
  });
}

/**
 * Gera um QR Code SVG simples
 */
function generateQRCodeSVG(data) {
  // Esta é uma implementação simplificada
  // Em produção, você usaria uma biblioteca como qrcode
  return `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12">
        ${data.substring(0, 20)}...
      </text>
    </svg>
  `;
}
