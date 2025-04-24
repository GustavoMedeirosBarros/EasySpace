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
  currentUser: Usuario | Empresa | null = null
  isEmpresa = false
  isLoading = true
  userLocais: Local[] = []
  totalLocais = 0
  totalFavoritos = 0
  mediaAvaliacoes = 0
  notificacoesNaoLidas = 0

  // Dados formatados para exibição
  userInfo: {
    nome: string
    email: string
    documento: string
    telefone: string
    celular: string
    localizacao: string
    dataCadastro: string
  } = {
      nome: "",
      email: "",
      documento: "",
      telefone: "",
      celular: "",
      localizacao: "",
      dataCadastro: "",
    }

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      if (!status) {
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "perfil",
            message: "Você precisa estar logado para acessar seu perfil",
          },
        })
        return
      }

      this.carregarDadosUsuario()
    })
  }

  carregarDadosUsuario(): void {
    this.isLoading = true

    this.currentUser = this.authService.currentUser
    this.isEmpresa = this.authService.isEmpresa()

    if (!this.currentUser) {
      this.isLoading = false
      return
    }

    this.formatarDadosUsuario()

    if (this.isEmpresa) {
      this.userLocais = this.mockDataService.getLocaisByOwner(true, (this.currentUser as Empresa).id_empresa)
    } else {
      this.userLocais = this.mockDataService.getLocaisByOwner(false, (this.currentUser as Usuario).id_usuario)
    }

    this.calcularEstatisticas()

    if (this.isEmpresa) {
      this.notificacoesNaoLidas = this.mockDataService.getNotificacoesNaoLidasCount(
        undefined,
        (this.currentUser as Empresa).id_empresa,
      )
    } else {
      this.notificacoesNaoLidas = this.mockDataService.getNotificacoesNaoLidasCount(
        (this.currentUser as Usuario).id_usuario,
      )
    }

    this.isLoading = false
  }

  formatarDadosUsuario(): void {
    if (!this.currentUser) return

    if (this.isEmpresa) {
      const empresa = this.currentUser as Empresa
      this.userInfo = {
        nome: empresa.nome_empresa,
        email: empresa.email_empresa,
        documento: `CNPJ: ${empresa.cnpj}`,
        telefone: empresa.telefone_empresa || "Não informado",
        celular: empresa.celular_empresa || "Não informado",
        localizacao:
          empresa.cidade_empresa && empresa.estado_empresa
            ? `${empresa.cidade_empresa}, ${empresa.estado_empresa}`
            : "Não informada",
        dataCadastro: "Janeiro/2023", // Data fictícia para demonstração
      }
    } else {
      const usuario = this.currentUser as Usuario
      this.userInfo = {
        nome: usuario.nome_usuario,
        email: usuario.email_usuario,
        documento: `CPF: ${usuario.cpf}`,
        telefone: usuario.telefone_usuario || "Não informado",
        celular: usuario.celular_usuario || "Não informado",
        localizacao:
          usuario.cidade_usuario && usuario.estado_usuario
            ? `${usuario.cidade_usuario}, ${usuario.estado_usuario}`
            : "Não informada",
        dataCadastro: "Março/2023",
      }
    }
  }

  calcularEstatisticas(): void {
    this.totalLocais = this.userLocais.length

    this.totalFavoritos = this.userLocais.reduce((total, local) => {
      const favoritos = this.mockDataService.getFavoritosByLocal(local.id_local).length
      return total + favoritos
    }, 0)

    if (this.totalLocais > 0) {
      const somaAvaliacoes = this.userLocais.reduce((soma, local) => soma + local.avaliacao, 0)
      this.mediaAvaliacoes = Number.parseFloat((somaAvaliacoes / this.totalLocais).toFixed(1))
    }
  }

  getLocacaoText(local: Local): string {
    if (local.tipo_locacao === "hora") {
      return `/Hora`
    } else if (local.tipo_locacao === "dia") {
      return `/Dia`
    } else if (local.tipo_locacao === "semana") {
      return `/Semana`
    } else if (local.tipo_locacao === "mes") {
      return `/Mês`
    }
    return ""
  }

  irParaConfiguracoes(): void {
    this.router.navigate(["/configuracoes"])
  }

  irParaMeusAnuncios(): void {
    this.router.navigate(["/meus-anuncios"])
  }

  irParaNotificacoes(): void {
    this.router.navigate(["/notificacoes"])
  }

  irParaFavoritos(): void {
    this.router.navigate(["/favoritos"])
  }
}
