import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Conversa, Mensagem } from '../../models/Mensagem';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { Local } from '../../models/Local';
import { Reserva } from '../../models/Reserva';
import { AuthService } from '../../services/auth.service';
import { MockDataService } from '../../services/mock.dados.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @ViewChild("chatMessages") private chatMessagesContainer!: ElementRef

  isLoggedIn = false
  isLoading = true
  conversas: Conversa[] = []
  mensagens: Mensagem[] = []
  conversaAtual: Conversa | null = null
  novaMensagem = ""
  usuarioAtual: Usuario | null = null
  empresaAtual: Empresa | null = null
  isUsuario = false
  errorMessage = ""
  localMap: Map<number, Local> = new Map()
  reservaMap: Map<number, Reserva> = new Map()
  usuarioMap: Map<number, Usuario> = new Map()
  empresaMap: Map<number, Empresa> = new Map()
  searchTerm = ""
  conversasFiltradas: Conversa[] = []
  shouldScrollToBottom = false

  constructor(
    private authService: AuthService,
    private mockDataService: MockDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (!status) {
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "chat",
            message: "Você precisa estar logado para acessar o chat",
          },
        })
      } else {
        this.carregarDadosUsuario()

        this.route.queryParams.subscribe((params) => {
          const reservaId = params["reservaId"]
          const localId = params["localId"]

          if (reservaId && localId) {
            this.abrirOuCriarConversa(Number(localId), Number(reservaId))
          }
        })
      }
    })
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom()
      this.shouldScrollToBottom = false
    }
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight
    } catch (err) { }
  }

  carregarDadosUsuario(): void {
    this.isUsuario = this.authService.isUsuario()

    if (this.isUsuario) {
      this.usuarioAtual = this.authService.getCurrentUsuario()
      if (this.usuarioAtual) {
        this.carregarConversas()
      }
    } else {
      this.empresaAtual = this.authService.getCurrentEmpresa()
      if (this.empresaAtual) {
        this.carregarConversas()
      }
    }
  }

  carregarConversas(): void {
    this.isLoading = true

    let conversas: Conversa[] = []
    const storedConversas = localStorage.getItem("conversas")
    if (storedConversas) {
      conversas = JSON.parse(storedConversas)
    }

    if (this.isUsuario && this.usuarioAtual) {
      this.conversas = conversas.filter((c) => c.id_usuario === this.usuarioAtual?.id_usuario)
    } else if (this.empresaAtual) {
      this.conversas = conversas.filter((c) => c.id_empresa === this.empresaAtual?.id_empresa)
    }

    this.conversas.sort((a, b) => {
      if (!a.data_ultima_mensagem) return 1
      if (!b.data_ultima_mensagem) return -1
      return new Date(b.data_ultima_mensagem).getTime() - new Date(a.data_ultima_mensagem).getTime()
    })

    this.conversas.forEach((conversa) => {
      const local = this.mockDataService.getLocalById(conversa.id_local)
      if (local) {
        this.localMap.set(conversa.id_local, local)

        if (local.id_usuario) {
          const usuario = this.mockDataService.getUsuarioById(local.id_usuario)
          if (usuario) this.usuarioMap.set(local.id_usuario, usuario)
        } else if (local.id_empresa) {
          const empresa = this.mockDataService.getEmpresaById(local.id_empresa)
          if (empresa) this.empresaMap.set(local.id_empresa, empresa)
        }
      }

      if (conversa.id_usuario) {
        const usuario = this.mockDataService.getUsuarioById(conversa.id_usuario)
        if (usuario) this.usuarioMap.set(conversa.id_usuario, usuario)
      }

      if (conversa.id_empresa) {
        const empresa = this.mockDataService.getEmpresaById(conversa.id_empresa)
        if (empresa) this.empresaMap.set(conversa.id_empresa, empresa)
      }

      if (conversa.id_reserva) {
        const reservas = this.mockDataService.getReservaById(conversa.id_reserva)
        if (reservas) this.reservaMap.set(conversa.id_reserva, reservas)
      }
    })

    this.conversasFiltradas = [...this.conversas]
    this.isLoading = false
  }

  abrirOuCriarConversa(localId: number, reservaId?: number): void {
    let conversa = this.conversas.find((c) => c.id_local === localId)

    if (reservaId) {
      const reserva = this.mockDataService.getReservaById(reservaId);
      if (reserva) {
        this.reservaMap.set(reservaId, reserva);
      }
    }

    if (!conversa) {
      const local = this.mockDataService.getLocalById(localId)
      if (!local) {
        this.errorMessage = "Local não encontrado"
        return
      }


      const titulo = local.nome_local

      const novaConversa: Conversa = {
        id_conversa: 0,
        id_usuario: this.usuarioAtual?.id_usuario || 0,
        id_local: localId,
        titulo: titulo,
        nao_lidas_usuario: 0,
        nao_lidas_empresa: 0,
      }

      if (local.id_empresa) {
        novaConversa.id_empresa = local.id_empresa
      }

      if (reservaId) {
        novaConversa.id_reserva = reservaId

        const reserva = this.mockDataService.getReservaById(reservaId)
        if (reserva) {
          this.reservaMap.set(reservaId, reserva)
        }
      }

      let todasConversas: Conversa[] = []
      const storedConversas = localStorage.getItem("conversas")
      if (storedConversas) {
        todasConversas = JSON.parse(storedConversas)
      }

      const newId = todasConversas.length > 0 ? Math.max(...todasConversas.map((c) => c.id_conversa)) + 1 : 1

      novaConversa.id_conversa = newId

      todasConversas.push(novaConversa)
      localStorage.setItem("conversas", JSON.stringify(todasConversas))

      this.conversas.unshift(novaConversa)
      this.conversasFiltradas = [...this.conversas]

      this.localMap.set(localId, local)

      if (local.id_usuario) {
        const usuario = this.mockDataService.getUsuarioById(local.id_usuario)
        if (usuario) this.usuarioMap.set(local.id_usuario, usuario)
      } else if (local.id_empresa) {
        const empresa = this.mockDataService.getEmpresaById(local.id_empresa)
        if (empresa) this.empresaMap.set(local.id_empresa, empresa)
      }

      conversa = novaConversa
    }

    this.abrirConversa(conversa)
  }

  abrirConversa(conversa: Conversa): void {
    this.conversaAtual = conversa

    this.carregarMensagens(conversa.id_conversa)

    this.marcarMensagensComoLidas(conversa)

    this.shouldScrollToBottom = true
  }

  carregarMensagens(idConversa: number): void {
    let mensagens: Mensagem[] = []
    const storedMensagens = localStorage.getItem("mensagens")


    if (storedMensagens) {
      mensagens = JSON.parse(storedMensagens)

      mensagens.forEach((mensagem) => {
        if (mensagem.data_envio) {
          mensagem.data_envio = new Date(mensagem.data_envio)
        }
      })
    }

    this.mensagens = mensagens.filter((m) => m.id_conversa === idConversa)

    this.mensagens.sort((a, b) => new Date(a.data_envio).getTime() - new Date(b.data_envio).getTime())
  }

  marcarMensagensComoLidas(conversa: Conversa): void {
    if (!conversa) return

    let mensagens: Mensagem[] = []
    const storedMensagens = localStorage.getItem("mensagens")
    if (storedMensagens) {
      mensagens = JSON.parse(storedMensagens)

      let atualizou = false

      mensagens.forEach((mensagem) => {
        if (mensagem.id_conversa === conversa.id_conversa) {
          if (this.isUsuario && !mensagem.is_remetente_usuario && !mensagem.lida) {
            mensagem.lida = true
            atualizou = true
          } else if (!this.isUsuario && mensagem.is_remetente_usuario && !mensagem.lida) {
            mensagem.lida = true
            atualizou = true
          }
        }
      })

      if (atualizou) {
        localStorage.setItem("mensagens", JSON.stringify(mensagens))
      }
    }

    let conversas: Conversa[] = []
    const storedConversas = localStorage.getItem("conversas")
    if (storedConversas) {
      conversas = JSON.parse(storedConversas)

      const index = conversas.findIndex((c) => c.id_conversa === conversa.id_conversa)
      if (index !== -1) {
        if (this.isUsuario) {
          conversas[index].nao_lidas_usuario = 0
          conversa.nao_lidas_usuario = 0
        } else {
          conversas[index].nao_lidas_empresa = 0
          conversa.nao_lidas_empresa = 0
        }

        localStorage.setItem("conversas", JSON.stringify(conversas))
      }
    }
  }

  enviarMensagem(): void {
    if (!this.novaMensagem.trim() || !this.conversaAtual) return

    const novaMensagem: Mensagem = {
      id_mensagem: 0,
      id_conversa: this.conversaAtual.id_conversa,
      id_remetente: this.isUsuario ? this.usuarioAtual?.id_usuario || 0 : this.empresaAtual?.id_empresa || 0,
      is_remetente_usuario: this.isUsuario,
      conteudo: this.novaMensagem.trim(),
      data_envio: new Date(),
      lida: false,
      tipo: "texto",
    }

    let mensagens: Mensagem[] = []
    const storedMensagens = localStorage.getItem("mensagens")
    if (storedMensagens) {
      mensagens = JSON.parse(storedMensagens)
    }

    const newId = mensagens.length > 0 ? Math.max(...mensagens.map((m) => m.id_mensagem)) + 1 : 1

    novaMensagem.id_mensagem = newId

    mensagens.push(novaMensagem)
    localStorage.setItem("mensagens", JSON.stringify(mensagens))

    this.mensagens.push(novaMensagem)

    let conversas: Conversa[] = []
    const storedConversas = localStorage.getItem("conversas")
    if (storedConversas) {
      conversas = JSON.parse(storedConversas)

      const index = conversas.findIndex((c) => c.id_conversa === this.conversaAtual?.id_conversa)
      if (index !== -1) {
        conversas[index].ultima_mensagem = novaMensagem.conteudo
        conversas[index].data_ultima_mensagem = novaMensagem.data_envio

        if (this.isUsuario) {
          conversas[index].nao_lidas_empresa = (conversas[index].nao_lidas_empresa || 0) + 1
        } else {
          conversas[index].nao_lidas_usuario = (conversas[index].nao_lidas_usuario || 0) + 1
        }

        localStorage.setItem("conversas", JSON.stringify(conversas))

        if (this.conversaAtual) {
          this.conversaAtual.ultima_mensagem = novaMensagem.conteudo
          this.conversaAtual.data_ultima_mensagem = novaMensagem.data_envio
        }
      }
    }

    this.novaMensagem = ""

    this.shouldScrollToBottom = true
  }

  filtrarConversas(): void {
    if (!this.searchTerm.trim()) {
      this.conversasFiltradas = [...this.conversas]
      return
    }

    const termo = this.searchTerm.toLowerCase().trim()

    this.conversasFiltradas = this.conversas.filter((conversa) => {
      const local = this.localMap.get(conversa.id_local)
      if (!local) return false

      if (local.nome_local.toLowerCase().includes(termo)) return true

      if (local.cidade_local.toLowerCase().includes(termo)) return true

      if (conversa.ultima_mensagem?.toLowerCase().includes(termo)) return true

      return false
    })
  }

  formatarData(data: Date): string {
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(hoje.getDate() - 1)

    const dataObj = new Date(data)

    if (dataObj.toDateString() === hoje.toDateString()) {
      return dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }

    if (dataObj.toDateString() === ontem.toDateString()) {
      return `Ontem ${dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    }

    if (dataObj.getFullYear() === hoje.getFullYear()) {
      return (
        dataObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
        " " +
        dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      )
    }

    return (
      dataObj.toLocaleDateString("pt-BR") +
      " " +
      dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )
  }

  getNomeContato(conversa: Conversa): string {
    if (this.isUsuario) {
      const local = this.localMap.get(conversa.id_local)
      if (!local) return "Desconhecido"

      if (local.id_usuario) {
        const usuario = this.usuarioMap.get(local.id_usuario)
        return usuario ? usuario.nome_usuario : "Usuário"
      } else if (local.id_empresa) {
        const empresa = this.empresaMap.get(local.id_empresa)
        return empresa ? empresa.nome_empresa : "Empresa"
      }

      return "Proprietário"
    } else {
      const usuario = this.usuarioMap.get(conversa.id_usuario)
      return usuario ? usuario.nome_usuario : "Cliente"
    }
  }

  getImagemContato(conversa: Conversa): string {
    if (this.isUsuario) {
      const local = this.localMap.get(conversa.id_local)
      if (!local) return ""

      if (local.id_usuario) {
        const usuario = this.usuarioMap.get(local.id_usuario)
        return usuario?.foto_perfil || ""
      } else if (local.id_empresa) {
        const empresa = this.empresaMap.get(local.id_empresa)
        return empresa?.foto_perfil || ""
      }
    } else {
      const usuario = this.usuarioMap.get(conversa.id_usuario)
      return usuario?.foto_perfil || ""
    }

    return ""
  }

  getLocalNome(conversa: Conversa): string {
    const local = this.localMap.get(conversa.id_local)
    return local ? local.nome_local : "Local não encontrado"
  }

  getLocalImagem(conversa: Conversa): string {
    const local = this.localMap.get(conversa.id_local)
    return local ? local.imagem_local : ""
  }

  getReservaInfo(conversa: Conversa): string {
    if (!conversa.id_reserva) return ""

    const reserva = this.reservaMap.get(conversa.id_reserva)
    if (!reserva) return ""

    const dataInicio = new Date(reserva.data_inicio).toLocaleDateString("pt-BR")

    if (reserva.horario_inicio && reserva.horario_fim) {
      return `Reserva para ${dataInicio} - ${reserva.horario_inicio} às ${reserva.horario_fim}`
    } else {
      return `Reserva para ${dataInicio}`
    }
  }

  getNaoLidas(conversa: Conversa): number {
    return this.isUsuario ? conversa.nao_lidas_usuario : conversa.nao_lidas_empresa
  }

  temNaoLidas(conversa: Conversa): boolean {
    return this.getNaoLidas(conversa) > 0
  }

  isRemetente(mensagem: Mensagem): boolean {
    return this.isUsuario ? mensagem.is_remetente_usuario : !mensagem.is_remetente_usuario
  }

  getNomeRemetente(mensagem: Mensagem): string {
    if (mensagem.is_remetente_usuario) {
      const usuario = this.usuarioMap.get(mensagem.id_remetente)
      return usuario ? usuario.nome_usuario : "Usuário"
    } else {
      const empresa = this.empresaMap.get(mensagem.id_remetente)
      if (empresa) return empresa.nome_empresa

      const local = this.localMap.get(this.conversaAtual?.id_local || 0)
      if (local && local.id_usuario) {
        const usuario = this.usuarioMap.get(local.id_usuario)
        return usuario ? usuario.nome_usuario : "Proprietário"
      }

      return "Proprietário"
    }
  }

  getImagemRemetente(mensagem: Mensagem): string {
    if (mensagem.is_remetente_usuario) {
      const usuario = this.usuarioMap.get(mensagem.id_remetente)
      return usuario?.foto_perfil || ""
    } else {
      const empresa = this.empresaMap.get(mensagem.id_remetente)
      if (empresa) return empresa.foto_perfil || ""

      const local = this.localMap.get(this.conversaAtual?.id_local || 0)
      if (local && local.id_usuario) {
        const usuario = this.usuarioMap.get(local.id_usuario)
        return usuario?.foto_perfil || ""
      }
    }

    return ""
  }

  irParaLocal(idLocal: number): void {
    this.router.navigate(["/local", idLocal])
  }

  irParaReserva(idReserva: number): void {
    this.router.navigate(["/minhas-reservas"], {
      queryParams: { reservaId: idReserva },
    })
  }
}
