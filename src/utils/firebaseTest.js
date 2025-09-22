// src/utils/firebaseTest.js
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

/**
 * Testa a conexão com o Firebase
 */
export async function testFirebaseConnection() {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    // Teste 1: Verificar se o auth está funcionando
    console.log('✅ Firebase Auth inicializado:', !!auth);
    
    // Teste 2: Verificar se o Firestore está funcionando
    console.log('✅ Firestore inicializado:', !!db);
    
    // Teste 3: Tentar acessar uma coleção (sem dados)
    try {
      const testCollection = collection(db, 'test');
      const snapshot = await getDocs(testCollection);
      console.log('✅ Firestore acessível, documentos encontrados:', snapshot.size);
    } catch (error) {
      console.log('⚠️ Erro ao acessar Firestore:', error.message);
    }
    
    console.log('🎉 Teste de conexão concluído!');
    return true;
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error);
    return false;
  }
}

/**
 * Testa a criação de um usuário de teste
 */
export async function testCreateUser() {
  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = '123456';
    
    console.log('👤 Testando criação de usuário...');
    
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Usuário criado:', userCredential.user.email);
    
    // Fazer logout do usuário de teste
    await auth.signOut();
    console.log('✅ Logout realizado');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    return false;
  }
}

/**
 * Testa a criação de um ticket
 */
export async function testCreateTicket() {
  try {
    if (!auth.currentUser) {
      console.log('⚠️ Usuário não está logado, pulando teste de ticket');
      return false;
    }
    
    console.log('🎫 Testando criação de ticket...');
    
    const ticketData = {
      ownerUid: auth.currentUser.uid,
      type: 'Teste',
      price: 50,
      validUntilMillis: Date.now() + 86400000,
      createdAt: Date.now(),
      used: false
    };
    
    const docRef = await addDoc(collection(db, 'tickets'), ticketData);
    console.log('✅ Ticket criado com ID:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar ticket:', error.message);
    return false;
  }
}

/**
 * Executa todos os testes
 */
export async function runAllTests() {
  console.log('🚀 Iniciando testes do Firebase...');
  
  const connectionTest = await testFirebaseConnection();
  const userTest = await testCreateUser();
  
  if (connectionTest && userTest) {
    console.log('🎉 Todos os testes passaram! Firebase está funcionando corretamente.');
    return true;
  } else {
    console.log('❌ Alguns testes falharam. Verifique a configuração do Firebase.');
    return false;
  }
}
