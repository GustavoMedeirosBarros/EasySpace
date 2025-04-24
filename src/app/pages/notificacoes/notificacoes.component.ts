import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MockDataService } from '../../services/mock.dados.service';
import { Notificacao } from '../../models/Notificacao';

@Component({
  selector: 'app-notificacoes',
  imports: [RouterLink, CommonModule],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css'
})
export class NotificacoesComponent implements OnInit {
  notificacoes: Notificacao[] = []
  isLoading = true
  isLoggedIn = false
  filtroAtual = "todas"

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (status) {
        this.carregarNotificacoes()
      } else {
        this.isLoading = false
      }
    })
  }

  carregarNotificacoes(): void {
    this.isLoading = true

    if (this.authService.isUsuario()) {
      const usuario = this.authService.getCurrentUsuario()
      if (usuario) {
        this.notificacoes = this.mockDataService.getNotificacoesByUsuario(usuario.id_usuario)
      }
    } else if (this.authService.isEmpresa()) {
      const empresa = this.authService.getCurrentEmpresa()
      if (empresa) {
        this.notificacoes = this.mockDataService.getNotificacoesByEmpresa(empresa.id_empresa)
      }
    }

    this.notificacoes.sort((a, b) => b.data_notificacao.getTime() - a.data_notificacao.getTime())

    this.isLoading = false
  }

  filtrarNotificacoes(tipo: string): void {
    this.filtroAtual = tipo
  }

  get notificacoesFiltradas(): Notificacao[] {
    if (this.filtroAtual === "todas") {
      return this.notificacoes
    } else if (this.filtroAtual === "nao-lidas") {
      return this.notificacoes.filter((n) => !n.lida)
    } else {
      return this.notificacoes.filter((n) => n.tipo === this.filtroAtual)
    }
  }

  marcarComoLida(notificacao: Notificacao, event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    if (!notificacao.lida) {
      this.mockDataService.marcarNotificacaoComoLida(notificacao.id_notificacao)
      notificacao.lida = true
    }
  }

  excluirNotificacao(notificacao: Notificacao, event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    this.mockDataService.excluirNotificacao(notificacao.id_notificacao)
    this.notificacoes = this.notificacoes.filter((n) => n.id_notificacao !== notificacao.id_notificacao)
  }

  marcarTodasComoLidas(): void {
    if (this.authService.isUsuario()) {
      const usuario = this.authService.getCurrentUsuario()
      if (usuario) {
        this.mockDataService.marcarTodasNotificacoesComoLidas(usuario.id_usuario)
        this.notificacoes.forEach((n) => (n.lida = true))
      }
    } else if (this.authService.isEmpresa()) {
      const empresa = this.authService.getCurrentEmpresa()
      if (empresa) {
        this.mockDataService.marcarTodasNotificacoesComoLidas(undefined, empresa.id_empresa)
        this.notificacoes.forEach((n) => (n.lida = true))
      }
    }
  }

  excluirTodas(): void {
    if (confirm("Tem certeza que deseja excluir todas as notificações?")) {
      if (this.authService.isUsuario()) {
        const usuario = this.authService.getCurrentUsuario()
        if (usuario) {
          this.mockDataService.excluirTodasNotificacoes(usuario.id_usuario)
          this.notificacoes = []
        }
      } else if (this.authService.isEmpresa()) {
        const empresa = this.authService.getCurrentEmpresa()
        if (empresa) {
          this.mockDataService.excluirTodasNotificacoes(undefined, empresa.id_empresa)
          this.notificacoes = []
        }
      }
    }
  }

  navegarParaLink(notificacao: Notificacao): void {
    if (notificacao.link) {
      if (!notificacao.lida) {
        this.mockDataService.marcarNotificacaoComoLida(notificacao.id_notificacao)
        notificacao.lida = true
      }
      this.router.navigateByUrl(notificacao.link)
    }
  }

  getIconeClasse(notificacao: Notificacao): string {
    if (notificacao.icone) {
      return notificacao.icone
    }

    switch (notificacao.tipo) {
      case "sistema":
        return "bi-bell-fill"
      case "reserva":
        return "bi-calendar-check-fill"
      case "mensagem":
        return "bi-chat-dots-fill"
      case "favorito":
        return "bi-heart-fill"
      case "avaliacao":
        return "bi-star-fill"
      default:
        return "bi-bell-fill"
    }
  }

  getIconeCor(notificacao: Notificacao): string {
    switch (notificacao.tipo) {
      case "sistema":
        return "text-primary"
      case "reserva":
        return "text-success"
      case "mensagem":
        return "text-info"
      case "favorito":
        return "text-danger"
      case "avaliacao":
        return "text-warning"
      default:
        return "text-primary"
    }
  }

  formatarData(data: Date): string {
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(hoje.getDate() - 1)

    if (data.toDateString() === hoje.toDateString()) {
      return `Hoje, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (data.toDateString() === ontem.toDateString()) {
      return `Ontem, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  irParaLogin(): void {
    this.router.navigate(["/login"])
  }

  irParaRegistro(): void {
    this.router.navigate(["/register"])
  }
}
