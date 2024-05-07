import { UsuarioClaim } from "./usuario-claim";
import { UserRoles } from "./user-roles";
import { UserAllowedIP } from "./user-allowed-Ip";

export interface Usuario 
{
  id?: string;
  usuario?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string; 
  email?: string;
  telefonoCelular?: string;
  contrasena?: string;
  foto?: string;
  esAutentificado?: string;
  direccion?: string; 
  esActivo?: boolean; 
  esFotoModificada?: boolean;
  origen?: string;
  latitud?: number;
  longitud?: number;
  usuarioRoles?: UserRoles[];
  usuarioClaims?: UsuarioClaim[];
  usuarioAllowedIPs?: UserAllowedIP[];
}
