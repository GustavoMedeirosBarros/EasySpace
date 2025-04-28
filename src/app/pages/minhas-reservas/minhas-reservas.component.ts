import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../models/Reserva';
import { Local } from '../../models/Local';
import { AuthService } from '../../services/auth.service';
import { MockDataService } from '../../services/mock.dados.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-minhas-reservas',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './minhas-reservas.component.html',
  styleUrl: './minhas-reservas.component.css'
})
export class MinhasReservasComponent implements OnInit {
  isLoggedIn = false
  isLoading = true
  reservas: Reserva[] = []
  reservasFiltradas: Reserva[] = []
  locaisMap: Map<number, Local> = new Map()
  filtroAtual: "todas" | "pendentes" | "confirmadas" | "concluidas" | "canceladas" = "todas"
  searchTerm = ""
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private mockDataService: MockDataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (!status) {
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "minhas-reservas",
            message: "Você precisa estar logado para ver suas reservas",
          },
        })
      } else {
        this.carregarReservas()
      }
    })
  }

  carregarReservas(): void {
    this.isLoading = true
    const usuario = this.authService.getCurrentUsuario()

    if (!usuario) {
      this.isLoading = false
      this.errorMessage = "Erro ao carregar dados do usuário"
      return
    }

    // Carregar reservas do usuário
    this.reservas = this.mockDataService.getReservasByUsuario(usuario.id_usuario)

    // Ordenar por data (mais recentes primeiro)
    this.reservas.sort((a, b) => new Date(b.data_reserva).getTime() - new Date(a.data_reserva).getTime())

    // Carregar informações dos locais
    this.reservas.forEach((reserva) => {
      const local = this.mockDataService.getLocalById(reserva.id_local)
      if (local) {
        this.locaisMap.set(reserva.id_local, local)
      }
    })

    this.filtrarReservas("todas")
    this.isLoading = false
  }

  filtrarReservas(filtro: "todas" | "pendentes" | "confirmadas" | "concluidas" | "canceladas"): void {
    this.filtroAtual = filtro

    if (filtro === "todas") {
      this.reservasFiltradas = [...this.reservas]
    } else {
      const filtroMap: { [key: string]: string } = {
        pendentes: "pendente",
        confirmadas: "confirmada",
        concluidas: "concluida",
        canceladas: "cancelada",
      };
      const filtroSingular = filtroMap[filtro] || filtro;
      this.reservasFiltradas = this.reservas.filter((reserva) => reserva.status === filtroSingular);
    }

    // Aplicar termo de busca se existir
    if (this.searchTerm.trim()) {
      this.aplicarBusca()
    }
  }

  aplicarBusca(): void {
    const termo = this.searchTerm.toLowerCase().trim()

    if (!termo) {
      this.filtrarReservas(this.filtroAtual)
      return
    }

    this.reservasFiltradas = this.reservasFiltradas.filter((reserva) => {
      const local = this.locaisMap.get(reserva.id_local)
      if (!local) return false

      return (
        local.nome_local.toLowerCase().includes(termo) ||
        local.cidade_local.toLowerCase().includes(termo) ||
        local.tipo_local.toLowerCase().includes(termo) ||
        this.formatarData(reserva.data_inicio).toLowerCase().includes(termo)
      )
    })
  }

  cancelarReserva(reserva: Reserva): void {
    if (confirm("Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.")) {
      reserva.status = "cancelada"
      this.mockDataService.updateReserva(reserva)

      // Adicionar notificação para o proprietário
      const local = this.locaisMap.get(reserva.id_local)
      if (local) {
        if (local.id_usuario) {
          this.mockDataService.addNotificacao({
            id_notificacao: 0,
            id_usuario: local.id_usuario,
            titulo: "Reserva cancelada",
            mensagem: `A reserva para "${local.nome_local}" foi cancelada pelo cliente.`,
            data_notificacao: new Date(),
            lida: false,
            tipo: "reserva",
            link: "/minhas-reservas",
            icone: "bi-calendar-x-fill",
          })
        } else if (local.id_empresa) {
          this.mockDataService.addNotificacao({
            id_notificacao: 0,
            id_empresa: local.id_empresa,
            titulo: "Reserva cancelada",
            mensagem: `A reserva para "${local.nome_local}" foi cancelada pelo cliente.`,
            data_notificacao: new Date(),
            lida: false,
            tipo: "reserva",
            link: "/minhas-reservas",
            icone: "bi-calendar-x-fill",
          })
        }
      }

      this.successMessage = "Reserva cancelada com sucesso!"
      setTimeout(() => {
        this.successMessage = ""
      }, 5000)

      // Atualizar a lista de reservas
      this.filtrarReservas(this.filtroAtual)
    }
  }

  irParaChat(reserva: Reserva): void {
    this.router.navigate(["/chat"], {
      queryParams: {
        reservaId: reserva.id_reserva,
        localId: reserva.id_local,
      },
    })
  }

  irParaLocal(idLocal: number): void {
    this.router.navigate(["/local", idLocal])
  }

  irParaReservar(): void {
    this.router.navigate(["/explorar"])
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  formatarPreco(valor: number): string {
    return `R$ ${valor.toFixed(2)}`
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "pendente":
        return "bg-warning"
      case "confirmada":
        return "bg-success"
      case "cancelada":
        return "bg-danger"
      case "concluida":
        return "bg-info"
      default:
        return "bg-secondary"
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "pendente":
        return "Pendente"
      case "confirmada":
        return "Confirmada"
      case "cancelada":
        return "Cancelada"
      case "concluida":
        return "Concluída"
      default:
        return status
    }
  }

  getLocalNome(idLocal: number): string {
    const local = this.locaisMap.get(idLocal)
    return local ? local.nome_local : "Local não encontrado"
  }

  getLocalImagem(idLocal: number): string {
    const local = this.locaisMap.get(idLocal)
    return local ? local.imagem_local : "assets/images/placeholder.jpg"
  }

  getLocalEndereco(idLocal: number): string {
    const local = this.locaisMap.get(idLocal)
    return local ? `${local.cidade_local}, ${local.estado_local}` : ""
  }

  getLocalTipo(idLocal: number): string {
    const local = this.locaisMap.get(idLocal)
    if (!local) return ""

    const categoria = this.mockDataService.getCategorias().find((c) => c.id === local.tipo_local)
    return categoria ? categoria.name : local.tipo_local
  }

  getReservaDetalhes(reserva: Reserva): string {
    const local = this.locaisMap.get(reserva.id_local)
    if (!local) return ""

    if (local.tipo_locacao === "hora") {
      return `${this.formatarData(reserva.data_inicio)} - ${reserva.horario_inicio} às ${reserva.horario_fim}`
    } else if (local.tipo_locacao === "dia") {
      if (this.formatarData(reserva.data_inicio) === this.formatarData(reserva.data_fim)) {
        return `${this.formatarData(reserva.data_inicio)}`
      } else {
        return `${this.formatarData(reserva.data_inicio)} até ${this.formatarData(reserva.data_fim)}`
      }
    } else {
      return `A partir de ${this.formatarData(reserva.data_inicio)}`
    }
  }
}
