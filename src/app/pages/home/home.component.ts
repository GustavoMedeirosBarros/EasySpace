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
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,NgbCarouselModule]
})
export class HomeComponent implements OnInit {
  // Dados dos locais
  allLocais: Local[] = [];
  featuredLocais: Local[] = [];
  carouselImages = [
    {
      path: "/destaque1.png",
      alt: "Espaço para eventos",
      link: "#"  //colocar link da página turbo aluguel
    },
    {
      path: "/destaque2.png",
      alt: "Salas de reunião",
      link: "/criar-anuncio"  
    },
    {
      path: "/destaque3.png",
      alt: "Áreas externas",
      link: "/explorars"  
    }
  ];
  
  // Categorias
  categories: Category[] = [];
  popularCategories: Category[] = [
    { id: "eventos e cultura", name: "Eventos", icon: "bi-calendar-event" },
    { id: "coworking e escritorios", name: "Escritórios", icon: "bi-briefcase" },
    { id: "terrenos e areas externas", name: "Áreas Externas", icon: "bi-tree" }
  ];

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.categories = this.mockDataService.getCategorias();
    this.allLocais = this.mockDataService.getLocais();
    this.loadFeaturedLocais();
  }

  loadFeaturedLocais(): void {
    // Ordena por avaliação e pega os 6 melhores
    this.featuredLocais = [...this.allLocais]
      .sort((a, b) => b.avaliacao - a.avaliacao)
      .slice(0, 6);
  }

  toggleFavorite(local: Local, event: Event): void {
    event.stopPropagation();

    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/register'], {
        queryParams: { redirect: 'favorito', localId: local.id_local }
      });
      return;
    }

    const usuario = this.authService.getCurrentUsuario();
    if (!usuario) {
      console.error("Usuário não encontrado");
      return;
    }

    const usuarioId = usuario.id_usuario;
    const localId = local.id_local;

    try {
      if (this.mockDataService.isFavorito(localId, usuarioId)) {
        this.mockDataService.removeFavorito(localId, usuarioId);
        this.updateFavoriteIcon(event, false);
      } else {
        this.mockDataService.addFavorito(localId, usuarioId);
        this.updateFavoriteIcon(event, true);
      }
    } catch (error) {
      console.error("Erro ao gerenciar favorito:", error);
    }
  }

  private updateFavoriteIcon(event: Event, isFavorite: boolean): void {
    const favoriteBtn = event.currentTarget as HTMLElement;
    const icon = favoriteBtn.querySelector("i");
    if (icon) {
      icon.className = isFavorite 
        ? "bi bi-heart-fill text-danger" 
        : "bi bi-heart";
    }
  }

  isFavorito(localId: number): boolean {
    if (!this.authService.isLoggedIn) return false;
    const usuario = this.authService.getCurrentUsuario();
    return usuario ? this.mockDataService.isFavorito(localId, usuario.id_usuario) : false;
  }

  getLocacaoText(local: Local): string {
    switch (local.tipo_locacao) {
      case "hora": return "/Hora";
      case "dia": return "/Dia";
      case "mes": return "/Mês";
      default: return "";
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getLocalCategoryName(local: Local): string {
    return this.getCategoryName(local.tipo_local);
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/explorar'], { 
      queryParams: { categoria: categoryId } 
    });
  }

}