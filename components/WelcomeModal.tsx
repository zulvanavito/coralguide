import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Tokens } from '@/constants/Colors';

interface WelcomeModalProps {
  visible: boolean;
  onGetStarted: () => void;
}

export function WelcomeModal({ visible, onGetStarted }: WelcomeModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent={true}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require('@/assets/images/splashscreen.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView
          style={styles.safeArea}
          edges={['top', 'bottom', 'left', 'right']}
        >
          {/* Top Brand Title */}
          <View style={styles.topSection}>
            <Text style={styles.brandTitle}>Coral Island</Text>
            <Text style={styles.brandSubtitle}>Companion</Text>
          </View>

          {/* Bottom Call to Action */}
          <View style={styles.bottomSection}>
            <Text style={styles.tagline}>
              Your island journey,{'\n'}always with you
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={onGetStarted}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.xl,
    paddingBottom: Tokens.spacing.lg,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 48,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#134652',
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  brandSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D626F',
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: Tokens.spacing.md,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Tokens.spacing.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 5,
  },
  button: {
    width: '100%',
    minHeight: 52,
    backgroundColor: Palette.primary,
    borderRadius: Tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
