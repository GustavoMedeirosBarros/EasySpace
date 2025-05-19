import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Local } from '../../models/Local';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DadosPagamento, Reserva } from '../../models/Reserva';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';

registerLocaleData(localePt)

export const BRAZILIAN_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MMMM YYYY",
  },
}

@Component({
  selector: 'app-reservar-local',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatLabel, MatFormFieldModule, MatInputModule, MatNativeDateModule],
  templateUrl: './reservar-local.component.html',
  styleUrl: './reservar-local.component.css'
})
export class ReservarLocalComponent implements OnInit {
  localId!: number
  local: Local | null = null
  reservaForm!: FormGroup
  pagamentoForm!: FormGroup
  isLoading = true
  errorMessage = ""
  successMessage = ""
  currentStep = 1 // 1: Detalhes da reserva, 2: Pagamento, 3: Confirmação
  valorTotal = 0
  isSubmitting = false
  horariosDisponiveis: string[] = []
  diasDisponiveis: Date[] = []
  datasIndisponiveis: Date[] = [] // Datas que não estão disponíveis
  minDate = new Date() // Data mínima é hoje
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 6)) // Data máxima é 6 meses a partir de hoje
  mostrarDataFim = false; // Controla se deve mostrar o campo de data fim

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>,
    @Inject(LOCALE_ID) private locale: string
  ) {
    // Configurar o adaptador de data para usar o locale pt-BR
    this.dateAdapter.setLocale("pt-BR");
  }

  ngOnInit(): void {
    // Verificar se o usuário está logado
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/login"], {
        queryParams: {
          redirect: "reservar",
          message: "Você precisa estar logado para fazer uma reserva",
        },
      })
      return
    }

    // Inicializar formulários
    this.initForms()

    // Obter o ID do local da URL
    this.route.params.subscribe((params) => {
      this.localId = +params["id"]
      this.loadLocalData()
    })

    // Gerar horários disponíveis (simulação)
    this.gerarHorariosDisponiveis()

    // Gerar dias disponíveis (próximos 30 dias)
    this.gerarDiasDisponiveis()

    // Gerar datas indisponíveis (simulação)
    this.gerarDatasIndisponiveis()
  }

  initForms(): void {
    // Formulário de reserva com validadores básicos
    this.reservaForm = this.fb.group({
      data_inicio: ["", Validators.required],
      data_fim: [""],
      horario_inicio: [""],
      horario_fim: [""],
      quantidade_pessoas: [1, [Validators.required, Validators.min(1)]],
      observacoes: [""],
      multiplos_dias: [false],
    })

    // Formulário de pagamento
    this.pagamentoForm = this.fb.group({
      numero_cartao: ["", [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nome_titular: ["", Validators.required],
      validade: ["", [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      parcelas: [1, Validators.required],
      aceito_termos: [false, Validators.requiredTrue],
    })

    // Observar mudanças nos campos para calcular valor total
    this.reservaForm.valueChanges.subscribe(() => {
      this.calcularValorTotal()
    })

    // Observar mudanças no campo multiplos_dias
    this.reservaForm.get("multiplos_dias")?.valueChanges.subscribe((value) => {
      this.mostrarDataFim = value

      if (value && this.reservaForm.get("data_inicio")?.value) {
        // Se ativar múltiplos dias e já tiver data de início, define data fim como data início + 1 dia
        const dataInicio = new Date(this.reservaForm.get("data_inicio")?.value)
        const dataFim = new Date(dataInicio)
        dataFim.setDate(dataInicio.getDate() + 1)
        this.reservaForm.get("data_fim")?.setValue(dataFim)

        // Adicionar validador para data_fim
        if (this.local?.tipo_locacao === "dia") {
          this.reservaForm.get("data_fim")?.setValidators([Validators.required])
          this.reservaForm.get("data_fim")?.updateValueAndValidity()
        }
      } else if (!value) {
        // Se desativar múltiplos dias, limpa a data de fim e remove validadores
        this.reservaForm.get("data_fim")?.setValue(null)
        this.reservaForm.get("data_fim")?.clearValidators()
        this.reservaForm.get("data_fim")?.updateValueAndValidity()
      }

      this.calcularValorTotal()
    })
  }

  loadLocalData(): void {
    this.isLoading = true

    // Obter dados do local
    const local = this.mockDataService.getLocalById(this.localId)

    if (!local) {
      this.errorMessage = "Local não encontrado"
      this.isLoading = false
      return
    }

    this.local = local
    this.isLoading = false

    // Ajustar validadores com base no tipo de locação
    this.ajustarValidadoresPorTipoLocacao(local.tipo_locacao)

    // Se o tipo de locação for por dia, habilita a opção de múltiplos dias por padrão
    if (local.tipo_locacao === "dia") {
      this.reservaForm.get("multiplos_dias")?.setValue(true)
      this.mostrarDataFim = true
    }

    this.calcularValorTotal()
  }

  ajustarValidadoresPorTipoLocacao(tipoLocacao: string): void {
    // Remover todos os validadores primeiro
    this.reservaForm.get("horario_inicio")?.clearValidators()
    this.reservaForm.get("horario_fim")?.clearValidators()
    this.reservaForm.get("data_fim")?.clearValidators()

    // Adicionar validadores específicos com base no tipo de locação
    if (tipoLocacao === "hora") {
      this.reservaForm.get("horario_inicio")?.setValidators([Validators.required])
      this.reservaForm.get("horario_fim")?.setValidators([Validators.required])
    } else if (tipoLocacao === "dia" && this.mostrarDataFim) {
      this.reservaForm.get("data_fim")?.setValidators([Validators.required])
    }

    // Atualizar o estado dos controles
    this.reservaForm.get("horario_inicio")?.updateValueAndValidity()
    this.reservaForm.get("horario_fim")?.updateValueAndValidity()
    this.reservaForm.get("data_fim")?.updateValueAndValidity()
  }

  gerarHorariosDisponiveis(): void {
    // Simulação de horários disponíveis
    const horarios = []
    for (let hora = 8; hora <= 22; hora++) {
      horarios.push(`${hora.toString().padStart(2, "0")}:00`)
    }
    this.horariosDisponiveis = horarios
  }

  gerarDiasDisponiveis(): void {
    // Gerar próximos 30 dias como disponíveis
    const dias = []
    const hoje = new Date()
    for (let i = 1; i <= 30; i++) {
      const data = new Date(hoje)
      data.setDate(hoje.getDate() + i)
      dias.push(data)
    }
    this.diasDisponiveis = dias
  }

  gerarDatasIndisponiveis(): void {
    // Simulação de datas indisponíveis (aleatórias)
    const datasIndisponiveis = []
    const hoje = new Date()

    // Gerar 10 datas aleatórias indisponíveis nos próximos 6 meses
    for (let i = 0; i < 10; i++) {
      const randomDays = Math.floor(Math.random() * 180) + 1 // Entre 1 e 180 dias
      const dataIndisponivel = new Date(hoje)
      dataIndisponivel.setDate(hoje.getDate() + randomDays)
      datasIndisponiveis.push(dataIndisponivel)
    }

    this.datasIndisponiveis = datasIndisponiveis
  }

  // Filtro para o datepicker - retorna false para datas indisponíveis
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false

    // Verificar se a data está na lista de indisponíveis
    return !this.datasIndisponiveis.some(
      (dataIndisponivel) =>
        date.getDate() === dataIndisponivel.getDate() &&
        date.getMonth() === dataIndisponivel.getMonth() &&
        date.getFullYear() === dataIndisponivel.getFullYear(),
    )
  }

  // Manipulador de evento para seleção de data
  onDateSelection(event: any, controlName: string): void {
    const selectedDate = event.value
    this.reservaForm.get(controlName)?.setValue(selectedDate)

    // Se for data de início e múltiplos dias estiver ativado
    if (controlName === "data_inicio" && this.mostrarDataFim) {
      const dataFim = this.reservaForm.get("data_fim")?.value
      if (!dataFim || new Date(dataFim) <= new Date(selectedDate)) {
        // Definir data de fim como data de início + 1 dia
        const novaDataFim = new Date(selectedDate)
        novaDataFim.setDate(novaDataFim.getDate() + 1)
        this.reservaForm.get("data_fim")?.setValue(novaDataFim)
      }
    }

    this.calcularValorTotal()
  }

  calcularValorTotal(): void {
    if (!this.local) return
    const formValues = this.reservaForm.value
    const valorBase = this.local.valor
    let valorSubtotal = 0

    // Se o tipo de locação for por hora
    if (this.local.tipo_locacao === "hora" && formValues.horario_inicio && formValues.horario_fim) {
      const horaInicio = Number.parseInt(formValues.horario_inicio.split(":")[0], 10)
      const horaFim = Number.parseInt(formValues.horario_fim.split(":")[0], 10)

      // Verificar se o horário de fim é maior que o de início
      if (horaFim > horaInicio) {
        const horas = horaFim - horaInicio
        valorSubtotal = valorBase * horas
      } else {
        valorSubtotal = 0 // Horário inválido
      }
    }
    // Se múltiplos dias estiver ativado e tiver data início e fim
    else if (formValues.multiplos_dias && formValues.data_inicio && formValues.data_fim) {
      const dataInicio = new Date(formValues.data_inicio)
      const dataFim = new Date(formValues.data_fim)
      const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      valorSubtotal = valorBase * diffDays
    }
    // Se o tipo de locação for por dia (sem múltiplos dias)
    else if (this.local.tipo_locacao === "dia" && formValues.data_inicio) {
      valorSubtotal = valorBase // Um dia
    }
    // Se o tipo de locação for por mês
    else if (this.local.tipo_locacao === "mes") {
      valorSubtotal = valorBase
    }
    // Caso padrão (pelo menos 1 unidade)
    else {
      valorSubtotal = valorBase
    }

    // Calcular taxa de serviço (10% do subtotal)
    const taxaServico = valorSubtotal * 0.1

    // Valor total é o subtotal + taxa de serviço
    this.valorTotal = valorSubtotal + taxaServico
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      // Verificar apenas os campos relevantes com base no tipo de locação
      let formValido = true

      // Verificar data_inicio (sempre obrigatório)
      if (!this.reservaForm.get("data_inicio")?.valid) {
        this.reservaForm.get("data_inicio")?.markAsTouched()
        formValido = false
      }

      // Verificar quantidade_pessoas (sempre obrigatório)
      if (!this.reservaForm.get("quantidade_pessoas")?.valid) {
        this.reservaForm.get("quantidade_pessoas")?.markAsTouched()
        formValido = false
      }

      // Verificar campos específicos por tipo de locação
      if (this.local?.tipo_locacao === "hora") {
        if (!this.reservaForm.get("horario_inicio")?.valid) {
          this.reservaForm.get("horario_inicio")?.markAsTouched()
          formValido = false
        }
        if (!this.reservaForm.get("horario_fim")?.valid) {
          this.reservaForm.get("horario_fim")?.markAsTouched()
          formValido = false
        }
      } else if (this.local?.tipo_locacao === "dia" && this.mostrarDataFim) {
        if (!this.reservaForm.get("data_fim")?.valid) {
          this.reservaForm.get("data_fim")?.markAsTouched()
          formValido = false
        }
      }

      if (!formValido) {
        this.errorMessage = "Por favor, preencha todos os campos obrigatórios."
        return
      }

      // Verificar se a data de fim é posterior à data de início
      if (this.mostrarDataFim && this.reservaForm.value.data_inicio && this.reservaForm.value.data_fim) {
        const dataInicio = new Date(this.reservaForm.value.data_inicio)
        const dataFim = new Date(this.reservaForm.value.data_fim)
        if (dataFim < dataInicio) {
          this.errorMessage = "A data de término deve ser posterior à data de início."
          return
        }
      }

      // Verificar se o horário de fim é posterior ao horário de início
      if (
        this.local?.tipo_locacao === "hora" &&
        this.reservaForm.value.horario_inicio &&
        this.reservaForm.value.horario_fim
      ) {
        const horaInicio = this.reservaForm.value.horario_inicio
        const horaFim = this.reservaForm.value.horario_fim
        if (horaFim <= horaInicio) {
          this.errorMessage = "O horário de término deve ser posterior ao horário de início."
          return
        }
      }

      this.errorMessage = ""
      this.currentStep = 2
      window.scrollTo(0, 0)
    } else if (this.currentStep === 2) {
      if (this.pagamentoForm.invalid) {
        // Marcar todos os campos como tocados para mostrar erros
        Object.keys(this.pagamentoForm.controls).forEach((key) => {
          const control = this.pagamentoForm.get(key)
          control?.markAsTouched()
        })
        this.errorMessage = "Por favor, preencha todos os campos obrigatórios."
        return
      }

      this.errorMessage = ""
      this.submitReserva()
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
      window.scrollTo(0, 0)
    }
  }

  submitReserva(): void {
    this.isSubmitting = true
    this.errorMessage = ""
    this.successMessage = ""

    // Verificar se o usuário está logado
    if (!this.authService.isLoggedIn) {
      this.errorMessage = "Você precisa estar logado para fazer uma reserva."
      this.isSubmitting = false
      return
    }

    // Verificar se o local existe
    if (!this.local) {
      this.errorMessage = "Local não encontrado."
      this.isSubmitting = false
      return
    }

    // Obter o usuário logado
    const usuario = this.authService.getCurrentUsuario()
    if (!usuario) {
      this.errorMessage = "Erro ao obter dados do usuário."
      this.isSubmitting = false
      return
    }

    // Preparar dados da reserva
    const reservaData: Reserva = {
      id_reserva: 0, // Será definido pelo serviço
      id_local: this.local.id_local,
      id_usuario: usuario.id_usuario,
      data_inicio: new Date(this.reservaForm.value.data_inicio),
      data_fim:
        this.reservaForm.value.data_fim && this.mostrarDataFim
          ? new Date(this.reservaForm.value.data_fim)
          : new Date(this.reservaForm.value.data_inicio),
      horario_inicio: this.reservaForm.value.horario_inicio,
      horario_fim: this.reservaForm.value.horario_fim,
      valor_total: this.valorTotal,
      status: "confirmada",
      data_reserva: new Date(),
      quantidade_pessoas: this.reservaForm.value.quantidade_pessoas,
      observacoes: this.reservaForm.value.observacoes,
      metodo_pagamento: "Cartão de Crédito",
    }

    // Preparar dados do pagamento
    const pagamentoData: DadosPagamento = {
      numero_cartao: this.pagamentoForm.value.numero_cartao,
      nome_titular: this.pagamentoForm.value.nome_titular,
      validade: this.pagamentoForm.value.validade,
      cvv: this.pagamentoForm.value.cvv,
      parcelas: this.pagamentoForm.value.parcelas,
    }

    // Simular processamento de pagamento
    setTimeout(() => {
      try {
        // Adicionar a reserva
        const reserva = this.mockDataService.addReserva(reservaData)

        // Adicionar uma notificação para o proprietário
        if (this.local?.id_usuario) {
          this.mockDataService.addNotificacao({
            id_notificacao: 0,
            id_usuario: this.local.id_usuario,
            titulo: "Nova reserva recebida",
            mensagem: `Você recebeu uma nova reserva para "${this.local.nome_local}".`,
            data_notificacao: new Date(),
            lida: false,
            tipo: "reserva",
            link: "/minhas-reservas",
            icone: "bi-calendar-check-fill",
          })
        } else if (this.local?.id_empresa) {
          this.mockDataService.addNotificacao({
            id_notificacao: 0,
            id_empresa: this.local.id_empresa,
            titulo: "Nova reserva recebida",
            mensagem: `Você recebeu uma nova reserva para "${this.local.nome_local}".`,
            data_notificacao: new Date(),
            lida: false,
            tipo: "reserva",
            link: "/minhas-reservas",
            icone: "bi-calendar-check-fill",
          })
        }

        // Adicionar uma notificação para o usuário
        this.mockDataService.addNotificacao({
          id_notificacao: 0,
          id_usuario: usuario.id_usuario,
          titulo: "Reserva confirmada",
          mensagem: `Sua reserva para "${this.local?.nome_local}" foi confirmada.`,
          data_notificacao: new Date(),
          lida: false,
          tipo: "reserva",
          link: "/minhas-reservas",
          icone: "bi-calendar-check-fill",
        })

        this.successMessage = "Reserva realizada com sucesso!"
        this.currentStep = 3
        window.scrollTo(0, 0)
      } catch (error) {
        this.errorMessage = "Erro ao processar a reserva. Por favor, tente novamente."
        console.error("Erro ao processar reserva:", error)
      } finally {
        this.isSubmitting = false
      }
    }, 2000)
  }

  formatarPreco(valor: number): string {
    return `R$ ${valor.toFixed(2)}`
  }

  getLocacaoText(): string {
    if (!this.local) return ""

    switch (this.local.tipo_locacao) {
      case "hora":
        return "/hora"
      case "dia":
        return "/dia"
      case "semana":
        return "/semana"
      case "mes":
        return "/mês"
      default:
        return ""
    }
  }

  irParaChat(): void {
    // Redirecionar para o chat com o proprietário
    this.router.navigate(["/chat"], {
      queryParams: { localId: this.localId },
    })
  }

  irParaMinhasReservas(): void {
    this.router.navigate(["/minhas-reservas"])
  }

  voltarParaLocal(): void {
    this.router.navigate(["/local", this.localId])
  }

  formatarData(data: Date): string {
    if (!data) return "Data não definida"
    return data.toLocaleDateString("pt-BR")
  }

  // Retorna o período da reserva formatado para exibição
  getPeriodoReserva(): string {
    if (!this.reservaForm.value.data_inicio) return "Período não definido"

    const dataInicio = new Date(this.reservaForm.value.data_inicio)
    const dataInicioFormatada = dataInicio.toLocaleDateString("pt-BR")

    if (this.mostrarDataFim && this.reservaForm.value.data_fim) {
      const dataFim = new Date(this.reservaForm.value.data_fim)
      const dataFimFormatada = dataFim.toLocaleDateString("pt-BR")
      return `${dataInicioFormatada} até ${dataFimFormatada}`
    }

    return dataInicioFormatada
  }

  getMinDateForEndDate(): Date {
    return this.reservaForm.get('data_inicio')?.value ?
      new Date(this.reservaForm.get('data_inicio')?.value) :
      this.minDate;
  }
}
