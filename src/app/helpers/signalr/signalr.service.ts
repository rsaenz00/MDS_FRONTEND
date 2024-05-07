import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UsuarioEnlinea } from 'src/app/models/usuario-enlinea';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '../security/security.service';
import { environment } from '@environments/environment';
import { ClonerService } from '../clone/clone.service';

@Injectable({ providedIn: 'root' })

export class SignalrService 
{
    private hubConnection: signalR.HubConnection
    private onlineUsers_key: string = 'onlineuser_key';
    private _onlineUsers: BehaviorSubject<UsuarioEnlinea[]> = new BehaviorSubject<UsuarioEnlinea[]>([]);

    public get connectionId(): string 
    {
        return this.hubConnection.connectionId as any;
    }

    public get onlineUsers$(): Observable<UsuarioEnlinea[]> 
    {
        return this._onlineUsers.pipe
        (
            map((c: UsuarioEnlinea[]) => 
            {
                if (c && c.length > 0)
                {
                    return c;
                }
                else 
                {
                    const onlineUsersStr = localStorage.getItem(this.onlineUsers_key);
                    if (onlineUsersStr)
                    {
                        const onlineUser = JSON.parse(onlineUsersStr);
                        this._onlineUsers.next(onlineUser);
                        return onlineUser;
                    }
                    else
                    {
                        return null;
                    }
                }
            })
        );
    }

    constructor
    (
        private clonerService: ClonerService,
        private toastrService: ToastrService,
        private securityService: SecurityService
    ) 
    { }

    public startConnection(): Promise<boolean> 
    {
        return new Promise((resolve, reject) => 
        {
            this.hubConnection = new signalR.HubConnectionBuilder()
              .withUrl(`${environment.apiUrl}userHub`)
              .build();
            this.hubConnection
              .start()
              .then(() => {
                resolve(true)
              })
              .catch(err => {
                reject(false);
              });
        })
    }

    addUser(signalrUser: UsuarioEnlinea) 
    {
        this.hubConnection.invoke('join', signalrUser)
          .catch(err => console.error(err));
    }

    forceLogout(id: string) 
    {
        this.hubConnection.invoke('forceLogout', id)
          .catch(err => console.error(err));
    }

    logout(id: string) 
    {
        localStorage.removeItem(this.onlineUsers_key);
        this._onlineUsers.next([]);
        this.hubConnection.invoke('logout', id)
          .catch(err => console.error(err));
    }

    handleMessage = () => 
    {
        this.hubConnection.on('userLeft', (id: string) => 
        {
          this.removeUser(id);
        });
        
        this.hubConnection.on('newOnlineUser', (onlineUser: UsuarioEnlinea) => 
        {
          this.newOnlineUser(onlineUser);
        });
    
        this.hubConnection.on('Joined', (onlineUser: UsuarioEnlinea) => 
        {
        });
    
        this.hubConnection.on('logout', (onlineUser: UsuarioEnlinea) => 
        {
          this.removeUser(onlineUser.id);
        });
    
        this.hubConnection.on('forceLogout', (onlineUser: UsuarioEnlinea) => 
        {
          this.removeUser(onlineUser.id);
          this.toastrService.error('Admin logout you forcefully.');
          this.securityService.logout();
        });
    
        this.hubConnection.on('onlineUsers', (onlineUsers: UsuarioEnlinea[]) => 
        {
          if (onlineUsers.length > 0) 
          {
            const onlineUsersStr = JSON.stringify(onlineUsers);
            localStorage.setItem(this.onlineUsers_key, onlineUsersStr);
            this._onlineUsers.next(onlineUsers);
          }
          else 
          {
            localStorage.removeItem(this.onlineUsers_key);
            this._onlineUsers.next(this.clonerService.deepClone<UsuarioEnlinea[]>([]));
          }
        });
    
        this.hubConnection.on('sendDM', (message: string, sender: UsuarioEnlinea[]) => 
        {
        });
    }

    newOnlineUser(onlineUser: UsuarioEnlinea): void 
    {
        const onlineUsersStr = localStorage.getItem(this.onlineUsers_key) as any;
        const onlineUsers = JSON.parse(onlineUsersStr) as UsuarioEnlinea[];
        if (onlineUsers && !onlineUsers.find(c => c.id === onlineUser.id)) 
        {
          onlineUsers.push(onlineUser);
          this._onlineUsers.next(this.clonerService.deepClone<UsuarioEnlinea[]>(onlineUsers));
        } 
        else 
        {
          this._onlineUsers.next(this.clonerService.deepClone<UsuarioEnlinea[]>([onlineUser]));
        }
    }
    
    removeUser(id: string) 
    {
        const onlineUsersStr = localStorage.getItem(this.onlineUsers_key);
        if (onlineUsersStr) 
        {
          const onlineUsers = JSON.parse(onlineUsersStr) as UsuarioEnlinea[];
          const filterOnlineUsers = onlineUsers.filter(c => c.id !== id);
          localStorage.removeItem(this.onlineUsers_key);
          if (filterOnlineUsers && filterOnlineUsers.length > 0) 
          {
            localStorage.setItem(this.onlineUsers_key, JSON.stringify(filterOnlineUsers));
            this._onlineUsers.next(this.clonerService.deepClone<UsuarioEnlinea[]>(filterOnlineUsers));
          } 
          else 
          {
            this._onlineUsers.next(this.clonerService.deepClone<UsuarioEnlinea[]>([]));
          }
        } else {
          this._onlineUsers.next(this.clonerService.deepClone<UsuarioEnlinea[]>([]));
        }
    }

    
}