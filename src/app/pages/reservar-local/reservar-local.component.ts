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
  currentStep = 1
  valorTotal = 0
  isSubmitting = false
  horariosDisponiveis: string[] = []
  diasDisponiveis: Date[] = []
  datasIndisponiveis: Date[] = []
  minDate = new Date()
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 6))
  mostrarDataFim = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.dateAdapter.setLocale('pt-BR');
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/login"], {
        queryParams: {
          redirect: "reservar",
          message: "Você precisa estar logado para fazer uma reserva",
        },
      })
      return
    }

    this.initForms()

    this.route.params.subscribe((params) => {
      this.localId = +params["id"]
      this.loadLocalData()
    })

    this.gerarHorariosDisponiveis()

    this.gerarDiasDisponiveis()

    this.gerarDatasIndisponiveis()
  }

  initForms(): void {
    this.reservaForm = this.fb.group({
      data_inicio: ["", Validators.required],
      data_fim: [""],
      horario_inicio: ["", Validators.required],
      horario_fim: [""],
      quantidade_pessoas: [1, [Validators.required, Validators.min(1)]],
      observacoes: [""],
      multiplos_dias: [false],
    })

    this.pagamentoForm = this.fb.group({
      numero_cartao: ["", [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nome_titular: ["", Validators.required],
      validade: ["", [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      parcelas: [1, Validators.required],
      aceito_termos: [false, Validators.requiredTrue],
    })

    this.reservaForm.valueChanges.subscribe(() => {
      this.calcularValorTotal()
    })

    this.reservaForm.get("multiplos_dias")?.valueChanges.subscribe((value) => {
      this.mostrarDataFim = value

      if (value && this.reservaForm.get("data_inicio")?.value) {
        const dataInicio = new Date(this.reservaForm.get("data_inicio")?.value)
        const dataFim = new Date(dataInicio)
        dataFim.setDate(dataInicio.getDate() + 1)
        this.reservaForm.get("data_fim")?.setValue(dataFim)
      } else if (!value) {
        this.reservaForm.get("data_fim")?.setValue(null)
      }

      this.calcularValorTotal()
    })
  }

  loadLocalData(): void {
    this.isLoading = true

    const local = this.mockDataService.getLocalById(this.localId)

    if (!local) {
      this.errorMessage = "Local não encontrado"
      this.isLoading = false
      return
    }

    this.local = local
    this.isLoading = false

    if (local.tipo_locacao === "dia") {
      this.reservaForm.get("multiplos_dias")?.setValue(true)
      this.mostrarDataFim = true
    }

    this.calcularValorTotal()
  }

  gerarHorariosDisponiveis(): void {
    const horarios = []
    for (let hora = 8; hora <= 22; hora++) {
      horarios.push(`${hora.toString().padStart(2, "0")}:00`)
    }
    this.horariosDisponiveis = horarios
  }

  gerarDiasDisponiveis(): void {
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
    const datasIndisponiveis = []
    const hoje = new Date()

    for (let i = 0; i < 10; i++) {
      const randomDays = Math.floor(Math.random() * 180) + 1
      const dataIndisponivel = new Date(hoje)
      dataIndisponivel.setDate(hoje.getDate() + randomDays)
      datasIndisponiveis.push(dataIndisponivel)
    }

    this.datasIndisponiveis = datasIndisponiveis
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false

    return !this.datasIndisponiveis.some(
      (dataIndisponivel) =>
        date.getDate() === dataIndisponivel.getDate() &&
        date.getMonth() === dataIndisponivel.getMonth() &&
        date.getFullYear() === dataIndisponivel.getFullYear(),
    )
  }

  onDateSelection(event: any, controlName: string): void {
    const selectedDate = event.value
    this.reservaForm.get(controlName)?.setValue(selectedDate)

    if (controlName === "data_inicio" && this.mostrarDataFim) {
      const dataFim = this.reservaForm.get("data_fim")?.value
      if (!dataFim || new Date(dataFim) <= new Date(selectedDate)) {
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

    if (this.local.tipo_locacao === "hora" && formValues.horario_inicio && formValues.horario_fim) {
      const horaInicio = Number.parseInt(formValues.horario_inicio.split(":")[0], 10)
      const horaFim = Number.parseInt(formValues.horario_fim.split(":")[0], 10)
      const horas = horaFim > horaInicio ? horaFim - horaInicio : 0
      this.valorTotal = valorBase * horas
    }
    else if (formValues.multiplos_dias && formValues.data_inicio && formValues.data_fim) {
      const dataInicio = new Date(formValues.data_inicio)
      const dataFim = new Date(formValues.data_fim)
      const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      this.valorTotal = valorBase * diffDays
    }
    else if (this.local.tipo_locacao === "dia" && formValues.data_inicio) {
      this.valorTotal = valorBase
    }
    else if (this.local.tipo_locacao === "mes") {
      this.valorTotal = valorBase
    }
    else {
      this.valorTotal = valorBase
    }

    const taxaServico = this.valorTotal * 0.1
    this.valorTotal += taxaServico
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.reservaForm.invalid) {
        Object.keys(this.reservaForm.controls).forEach((key) => {
          const control = this.reservaForm.get(key)
          control?.markAsTouched()
        })
        this.errorMessage = "Por favor, preencha todos os campos obrigatórios."
        return
      }

      if (this.mostrarDataFim && this.reservaForm.value.data_inicio && this.reservaForm.value.data_fim) {
        const dataInicio = new Date(this.reservaForm.value.data_inicio)
        const dataFim = new Date(this.reservaForm.value.data_fim)
        if (dataFim < dataInicio) {
          this.errorMessage = "A data de término deve ser posterior à data de início."
          return
        }
      }

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

    if (!this.authService.isLoggedIn) {
      this.errorMessage = "Você precisa estar logado para fazer uma reserva."
      this.isSubmitting = false
      return
    }

    if (!this.local) {
      this.errorMessage = "Local não encontrado."
      this.isSubmitting = false
      return
    }

    const usuario = this.authService.getCurrentUsuario()
    if (!usuario) {
      this.errorMessage = "Erro ao obter dados do usuário."
      this.isSubmitting = false
      return
    }

    const reservaData: Reserva = {
      id_reserva: 0,
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

    const pagamentoData: DadosPagamento = {
      numero_cartao: this.pagamentoForm.value.numero_cartao,
      nome_titular: this.pagamentoForm.value.nome_titular,
      validade: this.pagamentoForm.value.validade,
      cvv: this.pagamentoForm.value.cvv,
      parcelas: this.pagamentoForm.value.parcelas,
    }

    setTimeout(() => {
      try {
        const reserva = this.mockDataService.addReserva(reservaData)

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
    const dataInicio = this.reservaForm.get('data_inicio')?.value;
    return dataInicio ? new Date(dataInicio) : this.minDate;
  }
}
