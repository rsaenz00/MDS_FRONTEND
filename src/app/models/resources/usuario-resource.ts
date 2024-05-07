import { ResourceParameter } from './resource-parameter';

export class UsuarioResource extends ResourceParameter 
{
  usuario: string = '';
  email: string = '';
  nombres: string = '';
  first_name: string = '';
  last_name: string = '';
  phone_number: string = '';
  is_active: boolean = true;
}
