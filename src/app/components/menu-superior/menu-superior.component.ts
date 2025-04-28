import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';
import { UserType } from '../../models/Auth';
import { MockDataService } from '../../services/mock.dados.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-menu-superior',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-superior.component.html',
  styleUrl: './menu-superior.component.css'
})
export class MenuSuperiorComponent implements OnInit {
  isLoggedIn = false
  userType: UserType | null = null
  currentUser: Usuario | Empresa | null = null
  userName = ""
  userEmail = ""
  notificacoesNaoLidas = 0
  userProfilePic = ""

  constructor(
    private authService: AuthService,
    private mockDataService: MockDataService,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.authService.isLoggedIn$,
      this.authService.userType$,
      this.authService.currentUser$
    ]).subscribe(([status, type, user]) => {
      this.isLoggedIn = status;
      this.userType = type;
      this.currentUser = user;
      this.updateUserInfo();
      this.atualizarContadorNotificacoes();
    });

    setInterval(() => {
      if (this.isLoggedIn && this.currentUser) {
        this.atualizarContadorNotificacoes();
      }
    }, 3000);
  }

  updateUserInfo(): void {
    if (!this.currentUser) {
      this.userName = ""
      this.userEmail = ""
      this.userProfilePic = ""
      return
    }

    console.log('Atualizando informações do usuário:', this.currentUser);

    if (this.userType === "usuario") {
      const usuario = this.currentUser as Usuario
      this.userName = usuario.nome_usuario
      this.userEmail = usuario.email_usuario
      this.userProfilePic = usuario.foto_perfil || ""
    } else if (this.userType === "empresa") {
      const empresa = this.currentUser as Empresa
      this.userName = empresa.nome_empresa
      this.userEmail = empresa.email_empresa
      this.userProfilePic = empresa.foto_perfil || ""
    }
  }

  atualizarContadorNotificacoes(): void {
    if (!this.isLoggedIn || !this.currentUser) {
      this.notificacoesNaoLidas = 0
      return
    }

    if (this.userType === "usuario") {
      const usuario = this.currentUser as Usuario
      this.notificacoesNaoLidas = this.mockDataService.getNotificacoesNaoLidasCount(usuario.id_usuario)
    } else if (this.userType === "empresa") {
      const empresa = this.currentUser as Empresa
      this.notificacoesNaoLidas = this.mockDataService.getNotificacoesNaoLidasCount(undefined, empresa.id_empresa)
    }
  }

  logout(): void {
    this.authService.logout()
  }
}
