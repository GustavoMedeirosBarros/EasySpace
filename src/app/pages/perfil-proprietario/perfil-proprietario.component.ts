import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { Local } from '../../models/Local';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock.dados.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-proprietario',
  imports: [RouterLink, CommonModule],
  templateUrl: './perfil-proprietario.component.html',
  styleUrl: './perfil-proprietario.component.css'
})
export class PerfilProprietarioComponent implements OnInit {
  owner: Usuario | Empresa | null = null
  isEmpresa = false
  ownerId = 0
  ownerLocais: Local[] = []
  isLoading = true
  error = false
  totalLocais = 0
  mediaAvaliacoes = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isEmpresa = this.router.url.includes("perfil-empresa")
      this.ownerId = +params["id"]
      this.loadOwnerProfile()
    })
  }

  loadOwnerProfile(): void {
    this.isLoading = true
    this.error = false

    setTimeout(() => {
      if (this.isEmpresa) {
        const empresa = this.mockDataService.getEmpresaById(this.ownerId)
        this.owner = empresa ? empresa : null
      } else {
        const usuario = this.mockDataService.getUsuarioById(this.ownerId)
        this.owner = usuario ? usuario : null
      }

      if (this.owner) {
        this.ownerLocais = this.mockDataService.getLocaisByOwner(this.isEmpresa, this.ownerId)
        this.totalLocais = this.ownerLocais.length

        if (this.totalLocais > 0) {
          const somaAvaliacoes = this.ownerLocais.reduce((soma, local) => soma + local.avaliacao, 0)
          this.mediaAvaliacoes = Number.parseFloat((somaAvaliacoes / this.totalLocais).toFixed(1))
        }
      } else {
        this.error = true
      }

      this.isLoading = false
    }, 500)
  }

  getOwnerName(): string {
    if (!this.owner) return ""

    if (this.isEmpresa) {
      return (this.owner as Empresa).nome_empresa
    } else {
      return (this.owner as Usuario).nome_usuario
    }
  }

  getOwnerEmail(): string {
    if (!this.owner) return ""

    if (this.isEmpresa) {
      return (this.owner as Empresa).email_empresa
    } else {
      return (this.owner as Usuario).email_usuario
    }
  }

  getOwnerPhone(): string {
    if (!this.owner) return ""

    if (this.isEmpresa) {
      return (this.owner as Empresa).celular_empresa || (this.owner as Empresa).telefone_empresa || ""
    } else {
      return (this.owner as Usuario).celular_usuario || (this.owner as Usuario).telefone_usuario || ""
    }
  }

  getOwnerLocation(): string {
    if (!this.owner) return ""

    if (this.isEmpresa) {
      return `${(this.owner as Empresa).cidade_empresa}, ${(this.owner as Empresa).estado_empresa}`
    } else {
      return `${(this.owner as Usuario).cidade_usuario}, ${(this.owner as Usuario).estado_usuario}`
    }
  }

  getOwnerDocument(): string {
    if (!this.owner) return ""

    if (this.isEmpresa) {
      return `CNPJ: ${(this.owner as Empresa).cnpj}`
    } else {
      return `CPF: ${(this.owner as Usuario).cpf}`
    }
  }

  getLocacaoText(local: Local): string {
    if (local.tipo_locacao === "hora") {
      return `/Hora`
    } else if (local.tipo_locacao === "dia") {
      return `/Dia`
    } else if (local.tipo_locacao === "mes") {
      return `/Mês`
    }
    return ""
  }
  startChat(): void {
    console.log("Iniciando chat com o proprietário")
  }
}
