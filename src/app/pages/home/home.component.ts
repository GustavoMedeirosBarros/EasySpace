import { Component, OnInit } from '@angular/core';
import { Local } from '../../models/Local';
import { MockDataService } from '../../services/mock.dados.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

interface Category {
  id: string
  name: string
  icon: string
  description?: string
}

interface Testimonial {
  name: string
  image: string
  text: string
  rating: number
}

interface HowItWorks {
  title: string
  description: string
  icon: string
  step: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgbCarouselModule]
})
export class HomeComponent implements OnInit {
  allLocais: Local[] = []
  featuredLocais: Local[] = []
  recentLocais: Local[] = []
  carouselImages = [
    {
      path: "/destaque1.png",
      alt: "Espaço para eventos",
      link: "#",
    },
    {
      path: "/destaque2.png",
      alt: "Salas de reunião",
      link: "/criar-anuncio",
    },
    {
      path: "/destaque3.png",
      alt: "Áreas externas",
      link: "/explorar",
    },
  ]

  categories: Category[] = []
  popularCategories: Category[] = [
    {
      id: "eventos e cultura",
      name: "Eventos",
      icon: "bi-calendar-event",
      description: "Espaços para festas, shows e eventos culturais",
    },
    {
      id: "coworking e escritorios",
      name: "Escritórios",
      icon: "bi-briefcase",
      description: "Ambientes de trabalho compartilhados e salas de reunião",
    },
    {
      id: "terrenos e areas externas",
      name: "Áreas Externas",
      icon: "bi-tree",
      description: "Chácaras, jardins e espaços ao ar livre",
    },
    { id: "educacionais", name: "Educação", icon: "bi-book", description: "Salas de aula e espaços para treinamentos" },
  ]

  testimonials: Testimonial[] = [
    {
      name: "Carlos Silva",
      image: "icon_h.png",
      text: "Encontrei o espaço perfeito para minha reunião de negócios. O processo foi simples e rápido!",
      rating: 5,
    },
    {
      name: "Ana Oliveira",
      image: "icon_m.png",
      text: "A plataforma me ajudou a encontrar locais incríveis para os eventos que organizo. Recomendo!",
      rating: 5,
    },
    {
      name: "Roberto Martins",
      image: "icon_h.png",
      text: "Uso o Easy Space para encontrar salas de aula para meus workshops. Excelente variedade de opções!",
      rating: 4,
    },
  ]

  // Como funciona
  howItWorks: HowItWorks[] = [
    {
      step: 1,
      title: "Busque",
      description: "Encontre o espaço ideal para sua necessidade",
      icon: "bi-search",
    },
    {
      step: 2,
      title: "Reserve",
      description: "Faça sua reserva de forma rápida e segura",
      icon: "bi-calendar-check",
    },
    {
      step: 3,
      title: "Aproveite",
      description: "Utilize o espaço e aproveite sua experiência",
      icon: "bi-emoji-smile",
    },
  ]

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadInitialData()
  }

  loadInitialData(): void {
    this.categories = this.mockDataService.getCategorias()
    this.allLocais = this.mockDataService.getLocais()
    this.loadFeaturedLocais()
    this.loadRecentLocais()
  }

  loadFeaturedLocais(): void {
    this.featuredLocais = [...this.allLocais].sort((a, b) => b.avaliacao - a.avaliacao).slice(0, 6)
  }

  loadRecentLocais(): void {
    this.recentLocais = [...this.allLocais]
      .sort((a, b) => b.data_disponibilidade.getTime() - a.data_disponibilidade.getTime())
      .slice(0, 3)
  }

  toggleFavorite(local: Local, event: Event): void {
    event.stopPropagation()

    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/login"], {
        queryParams: { redirect: "favorito", localId: local.id_local },
      })
      return
    }

    const usuario = this.authService.getCurrentUsuario()
    if (!usuario) {
      console.error("Usuário não encontrado")
      return
    }

    const usuarioId = usuario.id_usuario
    const localId = local.id_local

    try {
      if (this.mockDataService.isFavorito(localId, usuarioId)) {
        this.mockDataService.removeFavorito(localId, usuarioId)
        this.updateFavoriteIcon(event, false)
      } else {
        this.mockDataService.addFavorito(localId, usuarioId)
        this.updateFavoriteIcon(event, true)
        this.router.navigate(["/favoritos"])
      }
    } catch (error) {
      console.error("Erro ao gerenciar favorito:", error)
    }
  }

  private updateFavoriteIcon(event: Event, isFavorite: boolean): void {
    const favoriteBtn = event.currentTarget as HTMLElement
    const icon = favoriteBtn.querySelector("i")
    if (icon) {
      icon.className = isFavorite ? "bi bi-heart-fill text-danger" : "bi bi-heart"
    }
  }

  isFavorito(localId: number): boolean {
    if (!this.authService.isLoggedIn) return false
    const usuario = this.authService.getCurrentUsuario()
    return usuario ? this.mockDataService.isFavorito(localId, usuario.id_usuario) : false
  }

  getLocacaoText(local: Local): string {
    switch (local.tipo_locacao) {
      case "hora":
        return "/Hora"
      case "dia":
        return "/Dia"
      case "mes":
        return "/Mês"
      default:
        return ""
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId)
    return category ? category.name : ""
  }

  getLocalCategoryName(local: Local): string {
    return this.getCategoryName(local.tipo_local)
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(["/explorar"], {
      queryParams: { categoria: categoryId },
    })
  }

  navigateToPopularCategory(categoryId: string): void {
    this.router.navigate(["/explorar"], {
      queryParams: { categoria: categoryId },
    })
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0)
  }
}