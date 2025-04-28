import { Component, OnInit } from '@angular/core';
import { Local } from '../../models/Local';
import { Usuario } from '../../models/Usuario';
import { Empresa } from '../../models/Empresa';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock.dados.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Comentario } from '../../models/Comentario';

@Component({
  selector: 'app-local-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './local-details.component.html',
  styleUrl: './local-details.component.css'
})

export class LocalDetailsComponent implements OnInit {
  local: Local | null = null
  owner: Usuario | Empresa | null = null
  currentImageIndex = 0
  comments: Comentario[] = []
  isLoading = true
  error = false
  ratingStats: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  isEmpresa = false
  ownerId = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const localId = +params["id"]
      this.loadLocalDetails(localId)
    })
  }

  loadLocalDetails(localId: number): void {
    this.isLoading = true
    this.error = false

    setTimeout(() => {
      const local = this.mockDataService.getLocalById(localId)

      if (local) {
        this.local = local

        if (local.id_usuario > 0) {
          const usuario = this.mockDataService.getUsuarioById(local.id_usuario);
          this.owner = usuario ? usuario : null;
          this.isEmpresa = false;
          this.ownerId = local.id_usuario;
        } else if (local.id_empresa > 0) {
          const empresa = this.mockDataService.getEmpresaById(local.id_empresa);
          this.owner = empresa ? empresa : null;
          this.isEmpresa = true;
          this.ownerId = local.id_empresa;
        }

        this.loadComments(localId)

        this.ratingStats = this.mockDataService.getAvaliacaoStats(localId)
      } else {
        this.error = true
      }

      this.isLoading = false
    }, 500)
  }

  loadComments(localId: number): void {
    this.comments = this.mockDataService.getComentariosByLocalId(localId)
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % 3
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + 3) % 3
  }

  getOwnerName(): string {
    if (!this.owner) return ""

    if ('nome_usuario' in this.owner) {
      return this.owner.nome_usuario;
    } else if ('nome_empresa' in this.owner) {
      return this.owner.nome_empresa;
    }
    return ""
  }

  getLocacaoText(): string {
    if (!this.local) return ""

    if (this.local.tipo_locacao === "hora") {
      return `/Hora`
    } else if (this.local.tipo_locacao === "dia") {
      return `/Dia`
    } else if (this.local.tipo_locacao === "mes") {
      return `/Mês`
    }
    return ""
  }

  formatDescription(description: string): string[] {
    return description.split("\n").filter((line) => line.trim() !== "")
  }

  startChat(): void {
    console.log("Iniciando chat com o proprietário do local")
  }

  viewOwnerProfile(): void {
    if (this.isEmpresa) {
      this.router.navigate(["/perfil-empresa", this.ownerId])
    } else {
      this.router.navigate(["/perfil-usuario", this.ownerId])
    }
  }

  getRatingPercentage(rating: number): number {
    const total = Object.values(this.ratingStats).reduce((sum, count) => sum + count, 0)
    if (total === 0) return 0
    return (this.ratingStats[rating] / total) * 100
  }

  getTotalRatings(): number {
    return Object.values(this.ratingStats).reduce((sum, count) => sum + count, 0)
  }

  getMapUrl(): SafeResourceUrl {
    if (!this.local) return this.sanitizer.bypassSecurityTrustResourceUrl("")

    const address = encodeURIComponent(
      `${this.local.endereco_local}, ${this.local.numero_local}, ${this.local.cidade_local}, ${this.local.estado_local}`,
    )

    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${this.local.longitude! - 0.01},${this.local.latitude! - 0.01},${this.local.longitude! + 0.01},${this.local.latitude! + 0.01}&layer=mapnik&marker=${this.local.latitude},${this.local.longitude}`

    return this.sanitizer.bypassSecurityTrustResourceUrl(osmUrl)
  }

  formatComodidade(comodidade: string): string {
    switch (comodidade) {
      case "wifi":
        return "Wi-Fi"
      case "ar-condicionado":
        return "Ar-condicionado"
      case "estacionamento":
        return "Estacionamento"
      case "piscina":
        return "Piscina"
      case "churrasqueira":
        return "Churrasqueira"
      case "projetor":
        return "Projetor"
      case "som":
        return "Sistema de Som"
      case "cafe":
        return "Serviço de Café"
      case "cozinha":
        return "Cozinha Equipada"
      case "seguranca":
        return "Segurança 24h"
      case "acessibilidade":
        return "Acessibilidade"
      case "vestiario":
        return "Vestiário"
      default:
        return comodidade.charAt(0).toUpperCase() + comodidade.slice(1)
    }
  }
}
