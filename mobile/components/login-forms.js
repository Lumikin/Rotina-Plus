import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '../constants/brand-colors';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');

    if (!email || !password) {
      setError('Preencha e-mail e senha para continuar.');
      return;
    }

    try {
      setLoading(true);

      // TODO: integrar com o serviço de autenticação do backend
      // const response = await login({ email, password });

      console.log('Login enviado:', { email, password });
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Não foi possível entrar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.label}>E-mail</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color={BrandColors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor={BrandColors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.label}>Senha</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={BrandColors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={BrandColors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="password"
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={BrandColors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color={BrandColors.white} />
        ) : (
          <Text style={styles.submitButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
    backgroundColor: BrandColors.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: BrandColors.text,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: BrandColors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#FDECEC',    
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: BrandColors.danger,
    fontSize: 14,
  },
});