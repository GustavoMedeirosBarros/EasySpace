import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Local } from '../../models/Local';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock.dados.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Category {
  id: string
  name: string
  icon: string
}

interface Comodidade {
  id: string
  name: string
}

@Component({
  selector: 'app-explorar',
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './explorar.component.html',
  styleUrl: './explorar.component.css'
})
export class ExplorarComponent implements OnInit {
  categories: Category[] = []
  selectedCategory = "todos"

  searchTerm = ""

  priceFilter: string | null = null
  ratingFilter: number | null = null
  distanceFilter: string | null = null
  amenitiesFilter: string[] = []

  comodidades: Comodidade[] = []

  allLocais: Local[] = []
  filteredLocais: Local[] = []

  currentPage = 1
  totalPages = 1
  itemsPerPage = 9

  sidebarOpen = false

  userLocation: { latitude: number; longitude: number } | null = null
  geoLocationAvailable = false

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.categories = this.mockDataService.getCategorias()

    this.allLocais = this.mockDataService.getLocais()

    this.loadComodidades()

    this.checkGeolocation()

    this.applyFilters()
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

  checkGeolocation(): void {
    if (navigator.geolocation) {
      this.geoLocationAvailable = true
      this.getUserLocation()
    } else {
      this.geoLocationAvailable = false
      console.log("Geolocalização não está disponível neste navegador.")
    }
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }

          this.mockDataService.setUserPosition(this.userLocation.latitude, this.userLocation.longitude)

          console.log("Localização obtida:", this.userLocation)

          if (this.distanceFilter) {
            this.applyFilters()
          }
        },
        (error) => {
          console.error("Erro ao obter localização:", error)
          this.geoLocationAvailable = false
        },
      )
    }
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId
    this.currentPage = 1
    this.applyFilters()
    this.closeSidebarOnMobile()
  }

  search(): void {
    this.currentPage = 1
    this.applyFilters()
  }

  applyPriceFilter(filter: string): void {
    this.priceFilter = filter
    this.currentPage = 1
    this.applyFilters()
  }

  applyRatingFilter(rating: number): void {
    this.ratingFilter = rating
    this.currentPage = 1
    this.applyFilters()
  }

  applyDistanceFilter(distance: string): void {
    if (!this.geoLocationAvailable) {
      alert("Para usar o filtro de distância, é necessário permitir o acesso à sua localização.")
      return
    }

    this.distanceFilter = distance
    this.currentPage = 1
    this.applyFilters()
  }

  toggleAmenityFilter(amenity: string): void {
    const index = this.amenitiesFilter.indexOf(amenity)
    if (index === -1) {
      this.amenitiesFilter.push(amenity)
    } else {
      this.amenitiesFilter.splice(index, 1)
    }
    this.currentPage = 1
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.allLocais]

    if (this.selectedCategory !== "todos") {
      filtered = filtered.filter((local) => local.tipo_local === this.selectedCategory)
    }

    if (this.searchTerm.trim() !== "") {
      const searchTermLower = this.searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (local) =>
          local.nome_local.toLowerCase().includes(searchTermLower) ||
          local.descricao_local.toLowerCase().includes(searchTermLower) ||
          local.cidade_local.toLowerCase().includes(searchTermLower),
      )
    }

    if (this.priceFilter) {
      if (this.priceFilter === "menor") {
        filtered.sort((a, b) => a.valor - b.valor)
      } else if (this.priceFilter === "maior") {
        filtered.sort((a, b) => b.valor - a.valor)
      }
    }

    if (this.ratingFilter !== null) {
      filtered = filtered.filter((local) => local.avaliacao >= this.ratingFilter!)
    }

    if (this.distanceFilter && this.userLocation) {
      let maxDistance = 0

      switch (this.distanceFilter) {
        case "proximo":
          filtered.sort((a, b) => {
            if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0

            const distA = this.mockDataService.calculateDistance(
              this.userLocation!.latitude,
              this.userLocation!.longitude,
              a.latitude,
              a.longitude,
            )

            const distB = this.mockDataService.calculateDistance(
              this.userLocation!.latitude,
              this.userLocation!.longitude,
              b.latitude,
              b.longitude,
            )

            return distA - distB
          })
          break

        case "5km":
          maxDistance = 5
          filtered = filtered.filter((local) => {
            if (!local.latitude || !local.longitude) return false

            const distance = this.mockDataService.calculateDistance(
              this.userLocation!.latitude,
              this.userLocation!.longitude,
              local.latitude,
              local.longitude,
            )

            return distance <= maxDistance
          })
          break

        case "10km":
          maxDistance = 10
          filtered = filtered.filter((local) => {
            if (!local.latitude || !local.longitude) return false

            const distance = this.mockDataService.calculateDistance(
              this.userLocation!.latitude,
              this.userLocation!.longitude,
              local.latitude,
              local.longitude,
            )

            return distance <= maxDistance
          })
          break
      }
    }

    if (this.amenitiesFilter.length > 0) {
      filtered = filtered.filter((local) => {
        if (!local.comodidades) return false
        return this.amenitiesFilter.every((amenity) => local.comodidades?.includes(amenity))
      })
    }

    this.filteredLocais = filtered

    this.totalPages = Math.ceil(this.filteredLocais.length / this.itemsPerPage)
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages)
    }
  }

  toggleFavorite(local: Local, event: Event): void {
    event.stopPropagation()

    if (!this.authService.isLoggedIn) {
      this.router.navigate(["/registro"], {
        queryParams: {
          redirect: "favorito",
          localId: local.id_local,
        },
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
        console.log(`Local ${local.nome_local} removido dos favoritos`)

        const favoriteBtn = event.currentTarget as HTMLElement
        const icon = favoriteBtn.querySelector("i")
        if (icon) {
          icon.className = "bi bi-heart"
        }
      } else {
        this.mockDataService.addFavorito(localId, usuarioId)
        console.log(`Local ${local.nome_local} adicionado aos favoritos`)

        const favoriteBtn = event.currentTarget as HTMLElement
        const icon = favoriteBtn.querySelector("i")
        if (icon) {
          icon.className = "bi bi-heart-fill text-danger"
        }
      }
    } catch (error) {
      console.error("Erro ao gerenciar favorito:", error)
    }
  }

  isFavorito(localId: number): boolean {
    if (!this.authService.isLoggedIn) {
      return false
    }

    const usuario = this.authService.getCurrentUsuario()
    if (!usuario) {
      return false
    }

    return this.mockDataService.isFavorito(localId, usuario.id_usuario)
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page
    }
  }

  get pages(): number[] {
    const visiblePages = 5
    const pages: number[] = []

    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2))
    const endPage = Math.min(this.totalPages, startPage + visiblePages - 1)

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  get paginatedLocais(): Local[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    return this.filteredLocais.slice(startIndex, startIndex + this.itemsPerPage)
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

  isFilterActive(filterType: string, value: string | number): boolean {
    switch (filterType) {
      case "price":
        return this.priceFilter === value
      case "rating":
        return this.ratingFilter === value
      case "distance":
        return this.distanceFilter === value
      case "amenity":
        return this.amenitiesFilter.includes(value as string)
      default:
        return false
    }
  }

  clearFilters(): void {
    this.selectedCategory = "todos"
    this.searchTerm = ""
    this.priceFilter = null
    this.ratingFilter = null
    this.distanceFilter = null
    this.amenitiesFilter = []
    this.currentPage = 1
    this.applyFilters()
    this.closeSidebarOnMobile()
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen

    if (this.sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 992) {
      this.sidebarOpen = false
      document.body.style.overflow = ""
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getLocalCategoryName(local: Local): string {
    return this.getCategoryName(local.tipo_local);
  }
}
