import { NavItem } from '../views/layout/full/vertical/sidebar/nav-item/nav-item';
import { Claim } from './claim';

export class UsuarioAuth {
  id?: string;
  usuario: string = '';
  nombres?: string = '';
  apellidoPaterno?: string = ''
  apellidoMaterno?: string = '';
  email: string = '';
  telefonoCelular?: string = '';
  token: string = '';
  esAutentificado: boolean = false;
  foto?: string;
  claims: Claim[] = [];
  menu : NavItem[] = []
}
