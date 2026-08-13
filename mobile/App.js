import { StatusBar } from 'expo-status-bar';
import LoginScreen from './screens/login-screen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <LoginScreen />
    </>
  );
}