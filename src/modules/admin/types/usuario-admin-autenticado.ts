export type PerfilUsuarioAdmin = 'ADMIN' | 'MARKETING';

export interface UsuarioAdminAutenticado {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuarioAdmin;
}
