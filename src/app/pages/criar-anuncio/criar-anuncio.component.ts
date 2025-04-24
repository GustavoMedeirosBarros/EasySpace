import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Local } from '../../models/Local';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';

interface Categoria {
  id: string
  name: string
  icon: string
}

@Component({
  selector: 'app-criar-anuncio',
  imports: [ReactiveFormsModule, CommonModule],
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

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (!status) {
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "criar-anuncio",
            message: "Você precisa estar logado para criar um anúncio",
          },
        })
      }
    })

    this.categorias = this.mockDataService.getCategorias()
      .filter((cat) => cat.id !== "todos");

    this.loadComodidades()
    this.initializeForm()
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
      Object.keys(this.anuncioForm.controls).forEach((key) => {
        const control = this.anuncioForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true

    if (!this.isLoggedIn) {
      this.router.navigate(["/login"], {
        queryParams: {
          redirect: "criar-anuncio",
          message: "Você precisa estar logado para criar um anúncio",
        },
      })
      return
    }

    const formData = this.anuncioForm.value

    const isEmpresa = this.authService.isEmpresa()

    const currentUser = this.authService.currentUser
    let userId = 0
    let empresaId = 0

    if (isEmpresa) {
      empresaId = (currentUser as Empresa)?.id_empresa || 0;
    } else {
      userId = (currentUser as Usuario)?.id_usuario || 0;
    }

    const novoLocal: Local = {
      id_local: 0,
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
      avaliacao: 0,
      id_empresa: empresaId,
      id_usuario: userId,
      latitude: formData.latitude,
      longitude: formData.longitude,
      comodidades: formData.comodidades,
    }

    setTimeout(() => {
      this.mockDataService.addLocal(novoLocal)

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

    if (cep && cep.length >= 8) {
      setTimeout(() => {
        this.anuncioForm.patchValue({
          cidade_local: "Sorocaba",
          estado_local: "SP",
        })
      }, 800)
    }
  }
  getCategoryName(categoryId: string | null): string {
    const category = this.categorias.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
}
