import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Local } from '../../models/Local';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';

interface Categoria {
  id: string
  name: string
}

@Component({
  selector: 'app-editar-anuncio',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-anuncio.component.html',
  styleUrl: './editar-anuncio.component.css'
})
export class EditarAnuncioComponent implements OnInit {
  anuncioForm!: FormGroup
  localId!: number
  local: Local | null = null
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
  isLoading = true
  errorMessage = ""
  successMessage = ""
  isOwner = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/login"], {
        queryParams: {
          redirect: "meus-anuncios",
          message: "Você precisa estar logado para editar um anúncio",
        },
      })
      return
    }

    this.initializeForm()

    this.categorias = this.mockDataService.getCategorias().filter((cat) => cat.id !== "todos")

    this.loadComodidades()

    this.route.params.subscribe((params) => {
      this.localId = +params["id"]
      this.loadLocalData()
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

  loadLocalData(): void {
    this.isLoading = true

    const local = this.mockDataService.getLocalById(this.localId)

    if (!local) {
      this.errorMessage = "Anúncio não encontrado"
      this.isLoading = false
      return
    }

    this.local = local

    const currentUser = this.authService.currentUser;
    const isEmpresa = this.authService.isEmpresa();

    if (isEmpresa) {
      const empresa = currentUser as Empresa;
      this.isOwner = empresa.id_empresa === local.id_empresa;
    } else {
      const usuario = currentUser as Usuario;
      this.isOwner = usuario.id_usuario === local.id_usuario;
      this.isLoading = false
    }

    this.anuncioForm.patchValue({
      nome_local: local.nome_local,
      tipo_local: local.tipo_local,
      descricao_local: local.descricao_local,
      imagem_local: local.imagem_local,
      cep: local.cep,
      endereco_local: local.endereco_local,
      numero_local: local.numero_local,
      cidade_local: local.cidade_local,
      estado_local: local.estado_local,
      celular_local: local.celular_local,
      capacidade: local.capacidade || "",
      valor: local.valor,
      tipo_locacao: local.tipo_locacao,
      data_disponibilidade: local.data_disponibilidade,
      latitude: local.latitude,
      longitude: local.longitude,
    })

    this.previewImage = local.imagem_local

    if (local.comodidades) {
      this.selectedComodidades = [...local.comodidades]
      this.anuncioForm.patchValue({
        comodidades: this.selectedComodidades,
      })
    }

    this.isLoading = false
  }

  loadComodidades(): void {
    const comodidadesArray = this.mockDataService.getComodidades()

    this.comodidades = comodidadesArray.map((comodidade) => {
      let name = comodidade

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

  toggleComodidade(comodidade: string): void {
    const index = this.selectedComodidades.indexOf(comodidade)
    if (index === -1) {
      this.selectedComodidades.push(comodidade)
    } else {
      this.selectedComodidades.splice(index, 1)
    }

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

  consultaCep(): void {
    const cep = this.anuncioForm.get("cep")?.value

    if (cep && cep.length >= 8) {
      setTimeout(() => {
        this.anuncioForm.patchValue({
          cidade_local: "Sorocaba",
          estado_local: "SP",
        })
      }, 800)
    }
  }

  submitForm(): void {
    if (this.anuncioForm.invalid) {
      Object.keys(this.anuncioForm.controls).forEach((key) => {
        const control = this.anuncioForm.get(key)
        control?.markAsTouched()
      })

      this.errorMessage = "Por favor, preencha todos os campos obrigatórios corretamente."
      return
    }

    this.isSubmitting = true
    this.errorMessage = ""
    this.successMessage = ""

    const formData = this.anuncioForm.value

    if (!this.local) {
      this.errorMessage = "Erro ao atualizar anúncio: dados não encontrados."
      this.isSubmitting = false
      return
    }

    const localAtualizado: Local = {
      ...this.local,
      nome_local: formData.nome_local,
      imagem_local: formData.imagem_local || this.local.imagem_local,
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
      capacidade: formData.capacidade,
      latitude: formData.latitude,
      longitude: formData.longitude,
      comodidades: formData.comodidades,
    }

    if ('capacidade' in this.local) {
      (localAtualizado as any).capacidade = formData.capacidade;
    }

    setTimeout(() => {
      try {
        this.mockDataService.updateLocal(localAtualizado)

        this.successMessage = "Anúncio atualizado com sucesso!"
        window.scrollTo(0, 0)

        setTimeout(() => {
          this.router.navigate(["/meus-anuncios"], {
            queryParams: { success: true, message: "Anúncio atualizado com sucesso!" },
          })
        }, 2000)
      } catch (error) {
        this.errorMessage = "Erro ao atualizar anúncio. Por favor, tente novamente."
        console.error("Erro ao atualizar anúncio:", error)
      } finally {
        this.isSubmitting = false
      }
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

  cancelarEdicao(): void {
    this.router.navigate(["/meus-anuncios"])
  }
}
