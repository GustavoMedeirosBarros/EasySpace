import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { Local } from '../../models/Local';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  isLoggedIn = false
  isUsuario = false
  currentUser: Usuario | Empresa | null = null
  meusLocais: Local[] = []
  totalLocais = 0
  totalFavoritos = 0
  totalVisualizacoes = 0
  avaliacaoMedia = 0

  constructor(
    private authService: AuthService,
    private mockDataService: MockDataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (!status) {
        this.router.navigate(["/login"])
      } else {
        this.carregarDadosUsuario()
      }
    })
  }

  carregarDadosUsuario(): void {
    this.isUsuario = this.authService.isUsuario()

    if (this.isUsuario) {
      const usuario = this.authService.getCurrentUsuario()
      if (usuario) {
        this.currentUser = usuario
        this.carregarDadosUsuarioComum(usuario.id_usuario)
      }
    } else {
      const empresa = this.authService.getCurrentEmpresa()
      if (empresa) {
        this.currentUser = empresa
        this.carregarDadosEmpresa(empresa.id_empresa)
      }
    }
  }

  carregarDadosUsuarioComum(usuarioId: number): void {
    this.meusLocais = this.mockDataService.getLocaisByOwner(false, usuarioId)
    this.totalLocais = this.meusLocais.length

    this.totalFavoritos = this.mockDataService.getFavoritosByUsuario(usuarioId).length

    this.totalVisualizacoes = this.meusLocais.reduce((total, local) => {
      const visualizacoes = Math.floor(local.avaliacao * 20)
      return total + visualizacoes
    }, 0)

    if (this.totalLocais > 0) {
      const somaAvaliacoes = this.meusLocais.reduce((soma, local) => soma + local.avaliacao, 0)
      this.avaliacaoMedia = somaAvaliacoes / this.totalLocais
    }
  }

  carregarDadosEmpresa(empresaId: number): void {
    this.meusLocais = this.mockDataService.getLocaisByOwner(true, empresaId)
    this.totalLocais = this.meusLocais.length

    this.totalVisualizacoes = this.meusLocais.reduce((total, local) => {
      const visualizacoes = Math.floor(local.avaliacao * 30)
      return total + visualizacoes
    }, 0)

    if (this.totalLocais > 0) {
      const somaAvaliacoes = this.meusLocais.reduce((soma, local) => soma + local.avaliacao, 0)
      this.avaliacaoMedia = somaAvaliacoes / this.totalLocais
    }
  }

  getNomeUsuario(): string {
    if (!this.currentUser) return ""

    if (this.isUsuario) {
      return (this.currentUser as Usuario).nome_usuario
    } else {
      return (this.currentUser as Empresa).nome_empresa
    }
  }

  getEmail(): string {
    if (!this.currentUser) return ""

    if (this.isUsuario) {
      return (this.currentUser as Usuario).email_usuario
    } else {
      return (this.currentUser as Empresa).email_empresa
    }
  }

  getTelefone(): string {
    if (!this.currentUser) return ""

    if (this.isUsuario) {
      return (
        (this.currentUser as Usuario).celular_usuario ||
        (this.currentUser as Usuario).telefone_usuario ||
        "Não informado"
      )
    } else {
      return (
        (this.currentUser as Empresa).celular_empresa ||
        (this.currentUser as Empresa).telefone_empresa ||
        "Não informado"
      )
    }
  }

  getEndereco(): string {
    if (!this.currentUser) return ""

    if (this.isUsuario) {
      const usuario = this.currentUser as Usuario
      return usuario.cidade_usuario && usuario.estado_usuario
        ? `${usuario.cidade_usuario}, ${usuario.estado_usuario}`
        : "Não informado"
    } else {
      const empresa = this.currentUser as Empresa
      return empresa.cidade_empresa && empresa.estado_empresa
        ? `${empresa.cidade_empresa}, ${empresa.estado_empresa}`
        : "Não informado"
    }
  }

  getDocumento(): string {
    if (!this.currentUser) return ""

    if (this.isUsuario) {
      return (this.currentUser as Usuario).cpf || "Não informado"
    } else {
      return (this.currentUser as Empresa).cnpj || "Não informado"
    }
  }

  irParaConfiguracoes(): void {
    this.router.navigate(["/configuracoes"])
  }

  irParaMeusAnuncios(): void {
    this.router.navigate(["/meus-anuncios"])
  }

  irParaCriarAnuncio(): void {
    this.router.navigate(["/criar-anuncio"])
  }

  irParaFavoritos(): void {
    this.router.navigate(["/favoritos"])
  }

  handleProfileImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string

        if (this.isUsuario && this.currentUser) {
          const usuario = this.currentUser as Usuario
          usuario.foto_perfil = imageUrl
          this.mockDataService.updateUsuario(usuario)
          this.authService.updateCurrentUser(usuario)
        } else if (this.currentUser) {
          const empresa = this.currentUser as Empresa
          empresa.foto_perfil = imageUrl
          this.mockDataService.updateEmpresa(empresa)
          this.authService.updateCurrentUser(empresa)
        }
      }

      reader.readAsDataURL(file)
    }
  }
}
