import { Image, StyleSheet, Text, View } from 'react-native';

export default function Sobre() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sobre nós</Text>

      <View style={styles.perfisContainer}>
        <View style={styles.perfil}>
          <Image
            source={require('@/assets/images/alano.png')}
            style={styles.imagem}
          />
          <Text style={styles.nome}>Alano Filho</Text>
        </View>

        <View style={styles.perfil}>
          <Image
            source={require('@/assets/images/luiz.png')}
            style={styles.imagem}
          />
          <Text style={styles.nome}>Luiz Vieira</Text>
        </View>

        <View style={styles.perfil}>
          <Image
            source={require('@/assets/images/arthur.png')}
            style={styles.imagem}
          />
          <Text style={styles.nome}>Arthur Rech</Text>
        </View>
      </View>

      <Text style={styles.descricao}>
        Nossa empresa foi criada com a ideia de melhorar o nosso relacionamento com a natureza
        tendo como produtos tijolos criados com restos de construções para termos um descarte
        melhor dos materiais reciclando-os, mas não apenas isso como também temos a ideia de ajudar
        os artistas a crescer profissionalmente dando oportunidades a todos para fazerem dos nossos
        produtos obras de arte como vasos entre outras coisas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 50,
    color: '#2563eb',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.5,
  },
  perfisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  perfil: {
    alignItems: 'center',
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    top: 110,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  nome: {
    fontSize: 14,
    fontWeight: '600',
    top: 140,
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
  descricao: {
    fontSize: 18,
    textAlign: 'justify',
    color: '#333',
    lineHeight: 26,
    top: 220,
    width: 320,
    fontFamily: 'SpaceMono',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
