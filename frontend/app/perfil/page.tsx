import { Metadata } from 'next';
import UserProfileDashboard from '@/components/user/UserProfileDashboard';

export const metadata: Metadata = {
  title: 'Mi Pasaporte Cultural & Perfil | Red de Ciudades Creativas',
  description: 'Gestiona tu pasaporte de explorador, circuitos completados, medallas culturales y acreditación de emprendimiento.',
};

export default function ProfilePage() {
  return <UserProfileDashboard />;
}
