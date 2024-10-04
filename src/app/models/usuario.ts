import { UsuarioClaim } from "./usuario-claim";
import { UserRoles } from "./user-roles";
import { UserAllowedIP } from "./user-allowed-Ip";

export interface Usuario {
  id_usuario?: string;
  id_persona?: string;
  usuario?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
  telefonoMovil?: string;
  contrasena?: string;
  foto?: string;
  esAutentificado?: string;
  direccion?: string;
  esActivo?: boolean;
  esFotoModificada?: boolean;
  origen?: string;
  latitud?: number;
  longitud?: number;
  usuario_creacion?: string;
  usuario_modificacion?: string;
  usuarioRoles?: UserRoles[];
  usuarioClaims?: UsuarioClaim[];
  usuarioAllowedIPs?: UserAllowedIP[];
  fecha_nacimiento?: Date;
  sexo?: string;
  tipo_documento?: string;
  numero_documento?: string;
}

export class PersonasSinUsuario {
  id_persona: number;
  numero_documento: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
}