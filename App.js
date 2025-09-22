import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { testFirebaseConnection } from './src/utils/firebaseTest';
import { colors } from './src/styles/colors';
import { typography } from './src/styles/typography';
import { spacing } from './src/styles/spacing';

const { width, height } = Dimensions.get('window');

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import BuyTicketScreen from './src/screens/BuyTicketScreen';
import TicketsScreen from './src/screens/TicketsScreen';
import AccountScreen from './src/screens/AccountScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoadingScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso contínua
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    const timer = setTimeout(() => pulseAnim.start(), 1500);
    
    return () => {
      clearTimeout(timer);
      pulseAnim.stop();
    };
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary[500], colors.secondary[500]]}
      style={styles.loadingContainer}
    >
      <Animated.View 
        style={[
          styles.loadingContent,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="ticket" size={width > 400 ? 80 : 60} color="white" />
        </Animated.View>
        <Text style={[styles.loadingTitle, { fontSize: width > 400 ? typography.fontSize['4xl'] : typography.fontSize['3xl'] }]}>
          TicketApp
        </Text>
        <Text style={[styles.loadingSubtitle, { fontSize: width > 400 ? typography.fontSize.lg : typography.fontSize.base }]}>
          Carregando sua experiência...
        </Text>
        
        {/* Indicador de progresso animado */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  transform: [{ scaleX: scaleAnim }]
                }
              ]} 
            />
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

function TabNavigator() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: false,
          tabBarVisible: true,
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -8,
            },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            height: 80,
            paddingBottom: 16,
            paddingTop: 16,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            let iconColor;
            
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              iconColor = focused ? colors.primary[600] : colors.neutral[400];
            }
            if (route.name === 'Tickets') {
              iconName = focused ? 'ticket' : 'ticket-outline';
              iconColor = focused ? colors.primary[600] : colors.neutral[400];
            }
            if (route.name === 'BuyTicket') {
              iconName = focused ? 'cart' : 'cart-outline';
              iconColor = focused ? colors.primary[600] : colors.neutral[400];
            }
            if (route.name === 'Conta') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
              iconColor = focused ? colors.primary[600] : colors.neutral[400];
            }
            
            return (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                {focused && (
                  <View style={styles.iconBackground} />
                )}
                <Ionicons 
                  name={iconName} 
                  size={focused ? 26 : 24} 
                  color={iconColor}
                  style={styles.tabIcon}
                />
              </View>
            );
          },
          tabBarActiveTintColor: colors.primary[600],
          tabBarInactiveTintColor: colors.neutral[400],
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
            marginTop: 6,
            letterSpacing: 0.5,
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarHideOnKeyboard: false,
            tabBarVisible: true,
            tabBarStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderTopWidth: 0,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -8,
              },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              height: 80,
              paddingBottom: 16,
              paddingTop: 16,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              zIndex: 1000,
              backdropFilter: 'blur(20px)',
            },
          }}
        />
        <Tab.Screen 
          name="Tickets" 
          component={TicketsScreen}
          options={{
            tabBarHideOnKeyboard: false,
            tabBarVisible: true,
            tabBarStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderTopWidth: 0,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -8,
              },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              height: 80,
              paddingBottom: 16,
              paddingTop: 16,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              zIndex: 1000,
              backdropFilter: 'blur(20px)',
            },
          }}
        />
        <Tab.Screen 
          name="BuyTicket" 
          component={BuyTicketScreen}
          options={{
            tabBarLabel: 'Comprar',
            tabBarHideOnKeyboard: false,
            tabBarVisible: true,
            tabBarStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderTopWidth: 0,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -8,
              },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              height: 80,
              paddingBottom: 16,
              paddingTop: 16,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              zIndex: 1000,
              backdropFilter: 'blur(20px)',
            },
          }}
        />
        <Tab.Screen 
          name="Conta" 
          component={AccountScreen}
          options={{
            tabBarHideOnKeyboard: false,
            tabBarVisible: true,
            tabBarStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderTopWidth: 0,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -8,
              },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              height: 80,
              paddingBottom: 16,
              paddingTop: 16,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              zIndex: 1000,
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="QRCode" component={QRCodeScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Testar conexão com Firebase
    testFirebaseConnection();
    
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[500]} />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          {user ? (
            <Stack.Screen name="Main" component={MainStack} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  loadingTitle: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: 'white',
    marginBottom: spacing[2],
  },
  loadingSubtitle: {
    fontSize: typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  tabIconContainer: {
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 50,
    minHeight: 50,
  },
  tabIconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  iconBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  tabIcon: {
    zIndex: 2,
  },
  progressContainer: {
    marginTop: spacing[8],
    width: width * 0.6,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
    width: '100%',
  },
});
