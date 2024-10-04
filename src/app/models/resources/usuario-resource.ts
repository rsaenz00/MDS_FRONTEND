import { ResourceParameter } from './resource-parameter';

export class UsuarioResource extends ResourceParameter {
  usuario: string = '';
  email: string = '';
  persona: string = '';
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  numero_documento: string = '';
  first_name: string = '';
  last_name: string = '';
  phone_number: string = '';
  is_active: boolean = true;
}
