import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Local } from '../../models/Local';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from "rxjs/operators"

interface Categoria {
  id: string
  name: string
  icon: string
}

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

@Component({
  selector: 'app-criar-anuncio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './criar-anuncio.component.html',
  styleUrl: './criar-anuncio.component.css'
})
export class CriarAnuncioComponent implements OnInit {
  step = 1
  anuncioForm!: FormGroup
  selectedCategory: string | null = null
  categorias: Categoria[] = []
  tiposLocacao: { id: string; name: string }[] = [
    { id: "hora", name: "Por hora" },
    { id: "dia", name: "Por dia" },
    { id: "semana", name: "Por semana" },
    { id: "mes", name: "Por mês" },
  ]
  comodidades: { id: string; name: string }[] = []
  selectedComodidades: string[] = []
  previewImage: string | null = null
  isSubmitting = false
  isLoggedIn = false
  isLoadingCep = false
  cepError: string | null = null
  categoriaSelecionada = ""

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    // Verificar se o usuário está logado
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (!status) {
        // Redirecionar para a página de login se não estiver logado
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "criar-anuncio",
            message: "Você precisa estar logado para criar um anúncio",
          },
        })
      }
    })

    // Carregar categorias do serviço
    this.categorias = this.mockDataService.getCategorias().filter((cat) => cat.id !== "todos")

    // Carregar comodidades disponíveis
    this.loadComodidades()

    // Inicializar o formulário
    this.initializeForm()
  }

  loadComodidades(): void {
    const comodidadesArray = this.mockDataService.getComodidades()

    this.comodidades = comodidadesArray.map((comodidade) => {
      let name = comodidade

      // Formata o nome da comodidade para exibição
      switch (comodidade) {
        case "wifi":
          name = "Wi-Fi"
          break
        case "ar-condicionado":
          name = "Ar-condicionado"
          break
        case "estacionamento":
          name = "Estacionamento"
          break
        case "piscina":
          name = "Piscina"
          break
        case "churrasqueira":
          name = "Churrasqueira"
          break
        case "projetor":
          name = "Projetor"
          break
        case "som":
          name = "Sistema de Som"
          break
        case "cafe":
          name = "Serviço de Café"
          break
        case "cozinha":
          name = "Cozinha Equipada"
          break
        case "seguranca":
          name = "Segurança 24h"
          break
        case "acessibilidade":
          name = "Acessibilidade"
          break
        case "vestiario":
          name = "Vestiário"
          break
        default:
          name = comodidade.charAt(0).toUpperCase() + comodidade.slice(1)
      }

      return { id: comodidade, name }
    })
  }

  initializeForm(): void {
    this.anuncioForm = this.fb.group({
      nome_local: ["", [Validators.required, Validators.minLength(5)]],
      tipo_local: ["", Validators.required],
      descricao_local: ["", [Validators.required, Validators.minLength(20)]],
      imagem_local: ["", Validators.required],
      cep: ["", [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      endereco_local: ["", Validators.required],
      numero_local: ["", Validators.required],
      cidade_local: ["", Validators.required],
      estado_local: ["", Validators.required],
      celular_local: ["", Validators.required],
      capacidade: ["", Validators.required],
      valor: ["", [Validators.required, Validators.min(1)]],
      tipo_locacao: ["hora", Validators.required],
      data_disponibilidade: [new Date(), Validators.required],
      comodidades: [[]],
      latitude: [null],
      longitude: [null],
    })
  }

  selectCategory(category: string): void {
    this.selectedCategory = category
    // Atualizar o nome da categoria selecionada para exibição
    const categoriaEncontrada = this.categorias.find((c) => c.id === category)
    if (categoriaEncontrada) {
      this.categoriaSelecionada = categoriaEncontrada.name
    }

    this.anuncioForm.patchValue({
      tipo_local: category,
    })
    this.nextStep()
  }

  toggleComodidade(comodidade: string): void {
    const index = this.selectedComodidades.indexOf(comodidade)
    if (index === -1) {
      this.selectedComodidades.push(comodidade)
    } else {
      this.selectedComodidades.splice(index, 1)
    }

    // Atualizar o valor no formulário
    this.anuncioForm.patchValue({
      comodidades: this.selectedComodidades,
    })
  }

  isComodidadeSelected(comodidade: string): boolean {
    return this.selectedComodidades.includes(comodidade)
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        this.previewImage = e.target?.result as string
        this.anuncioForm.patchValue({
          imagem_local: this.previewImage,
        })
      }

      reader.readAsDataURL(file)
    }
  }

  removeImage(): void {
    this.previewImage = null
    this.anuncioForm.patchValue({
      imagem_local: "",
    })
  }

  nextStep(): void {
    if (this.step === 1 || this.anuncioForm.valid) {
      this.step++
    } else {
      // Marcar todos os campos como tocados para mostrar erros
      Object.keys(this.anuncioForm.controls).forEach((key) => {
        const control = this.anuncioForm.get(key)
        control?.markAsTouched()
      })
    }
  }

  previousStep(): void {
    this.step--
  }

  submitForm(): void {
    if (this.anuncioForm.invalid) {
      // Marcar todos os campos como tocados para mostrar erros
      Object.keys(this.anuncioForm.controls).forEach((key) => {
        const control = this.anuncioForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true

    // Se o usuário não está logado, redirecionar para login
    if (!this.isLoggedIn) {
      this.router.navigate(["/login"], {
        queryParams: {
          redirect: "criar-anuncio",
          message: "Você precisa estar logado para criar um anúncio",
        },
      })
      return
    }

    // Preparar dados do formulário
    const formData = this.anuncioForm.value

    // Definir o tipo de usuário (empresa ou pessoa física)
    const isEmpresa = this.authService.isEmpresa()

    // Obter ID do usuário logado
    const currentUser = this.authService.currentUser
    let userId = 0
    let empresaId = 0

    if (isEmpresa && currentUser) {
      // Se for empresa, usar o id_empresa
      empresaId = "id_empresa" in currentUser ? currentUser.id_empresa : 0
    } else if (currentUser) {
      // Se for usuário comum, usar o id_usuario
      userId = "id_usuario" in currentUser ? currentUser.id_usuario : 0
    }

    // Criar objeto do novo local
    const novoLocal: Local = {
      id_local: 0, // Será definido pelo serviço
      nome_local: formData.nome_local,
      imagem_local: formData.imagem_local || "assets/images/default_space.jpg",
      cep: formData.cep,
      cidade_local: formData.cidade_local,
      estado_local: formData.estado_local,
      endereco_local: formData.endereco_local,
      numero_local: formData.numero_local,
      celular_local: formData.celular_local,
      descricao_local: formData.descricao_local,
      valor: Number.parseFloat(formData.valor),
      tipo_local: formData.tipo_local,
      tipo_locacao: formData.tipo_locacao,
      data_disponibilidade: formData.data_disponibilidade,
      avaliacao: 0, // Nova listagem, sem avaliações
      id_empresa: empresaId,
      id_usuario: userId,
      latitude: formData.latitude,
      longitude: formData.longitude,
      comodidades: formData.comodidades,
    }

    // Simular um atraso para demonstrar o loading
    setTimeout(() => {
      // Adicionar o local ao "banco de dados"
      this.mockDataService.addLocal(novoLocal)

      // Redirecionar para a página de sucesso ou para a listagem do local
      this.router.navigate(["/meus-anuncios"], {
        queryParams: { success: true, message: "Anúncio criado com sucesso!" },
      })
    }, 1500)
  }

  formatarPreco(): string {
    const valor = this.anuncioForm.get("valor")?.value
    const tipoLocacao = this.anuncioForm.get("tipo_locacao")?.value

    if (!valor) return ""

    let sufixo = ""

    switch (tipoLocacao) {
      case "hora":
        sufixo = "/hora"
        break
      case "dia":
        sufixo = "/dia"
        break
      case "semana":
        sufixo = "/semana"
        break
      case "mes":
        sufixo = "/mês"
        break
    }

    return `R$ ${Number.parseFloat(valor).toFixed(2)}${sufixo}`
  }

  consultaCep(): void {
    const cep = this.anuncioForm.get("cep")?.value

    if (!cep || cep.length < 8) {
      return
    }

    // Formatar o CEP removendo caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, "")

    // Mostrar indicador de carregamento
    this.isLoadingCep = true
    this.cepError = null

    // Fazer a chamada à API ViaCEP
    this.http
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .pipe(
        finalize(() => {
          this.isLoadingCep = false
        }),
      )
      .subscribe({
        next: (dados) => {
          if (!dados.erro) {
            // Preencher os campos do formulário com os dados retornados
            this.anuncioForm.patchValue({
              endereco_local: dados.logradouro,
              cidade_local: dados.localidade,
              estado_local: dados.uf,
            })

            // Obter as coordenadas geográficas a partir do endereço completo
            this.obterCoordenadas(dados)
          } else {
            // Mostrar mensagem de erro
            this.cepError = "CEP não encontrado"
          }
        },
        error: (erro) => {
          console.error("Erro ao consultar CEP:", erro)
          this.cepError = "Erro ao consultar CEP. Tente novamente."
        },
      })
  }

  obterCoordenadas(dadosCep: ViaCepResponse): void {
    // Montar o endereço completo para geocodificação
    const endereco = `${dadosCep.logradouro}, ${dadosCep.localidade}, ${dadosCep.uf}, ${dadosCep.cep}, Brasil`

    // Usar a API de Geocodificação do Nominatim (OpenStreetMap)
    this.http
      .get<any[]>(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: endereco,
          format: "json",
          limit: 1,
        },
        headers: {
          "Accept-Language": "pt-BR",
        },
      })
      .subscribe({
        next: (resultado) => {
          if (resultado && resultado.length > 0) {
            const latitude = Number.parseFloat(resultado[0].lat)
            const longitude = Number.parseFloat(resultado[0].lon)

            // Atualizar o formulário com as coordenadas
            this.anuncioForm.patchValue({
              latitude: latitude,
              longitude: longitude,
            })

            console.log(`Coordenadas obtidas: ${latitude}, ${longitude}`)
          }
        },
        error: (erro) => {
          console.error("Erro ao obter coordenadas:", erro)
        },
      })
  }
}
