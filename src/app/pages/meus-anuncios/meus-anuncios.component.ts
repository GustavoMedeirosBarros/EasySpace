import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Local } from '../../models/Local';
import { CommonModule } from '@angular/common';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meus-anuncios',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './meus-anuncios.component.html',
  styleUrl: './meus-anuncios.component.css'
})
export class MeusAnunciosComponent implements OnInit {
  meusLocais: Local[] = []
  isLoading = true
  isLoggedIn = false
  searchTerm = ""
  filteredLocais: Local[] = []
  successMessage: string | null = null
  errorMessage: string | null = null

  totalAnuncios = 0
  totalVisualizacoes = 0
  totalFavoritos = 0
  mediaAvaliacoes = 0

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (status) {
        this.carregarAnuncios()
      } else {
        this.isLoading = false
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "meus-anuncios",
            message: "Você precisa estar logado para ver seus anúncios",
          },
        })
      }
    })

    this.route.queryParams.subscribe((params) => {
      if (params["success"] && params["message"]) {
        this.successMessage = params["message"]
        setTimeout(() => {
          this.successMessage = null
        }, 5000)
      }

      if (params["error"] && params["message"]) {
        this.errorMessage = params["message"]
        setTimeout(() => {
          this.errorMessage = null
        }, 5000)
      }
    })
  }

  carregarAnuncios(): void {
    this.isLoading = true

    const isEmpresa = this.authService.isEmpresa()
    const currentUser = this.authService.currentUser

    if (!currentUser) {
      this.isLoading = false
      return
    }

    let ownerId = 0
    if (isEmpresa) {
      ownerId = (currentUser as Empresa).id_empresa || 0
    } else {
      ownerId = (currentUser as Usuario).id_usuario || 0
    }

    this.meusLocais = this.mockDataService.getLocaisByOwner(isEmpresa, ownerId)
    this.filteredLocais = [...this.meusLocais]

    this.calcularEstatisticas()

    this.isLoading = false
  }

  calcularEstatisticas(): void {
    this.totalAnuncios = this.meusLocais.length

    this.totalVisualizacoes = this.meusLocais.reduce((total, local) => {
      const visualizacoes = Math.floor(Math.random() * 90) + 10
      return total + visualizacoes
    }, 0)

    this.totalFavoritos = this.meusLocais.reduce((total, local) => {
      const favoritos = this.mockDataService.getFavoritosByLocal(local.id_local).length
      return total + favoritos
    }, 0)

    if (this.totalAnuncios > 0) {
      const somaAvaliacoes = this.meusLocais.reduce((soma, local) => soma + local.avaliacao, 0)
      this.mediaAvaliacoes = Number.parseFloat((somaAvaliacoes / this.totalAnuncios).toFixed(1))
    }
  }

  filtrarAnuncios(): void {
    if (!this.searchTerm.trim()) {
      this.filteredLocais = [...this.meusLocais]
      return
    }

    const term = this.searchTerm.toLowerCase().trim()
    this.filteredLocais = this.meusLocais.filter(
      (local) =>
        local.nome_local.toLowerCase().includes(term) ||
        local.descricao_local.toLowerCase().includes(term) ||
        local.cidade_local.toLowerCase().includes(term) ||
        local.tipo_local.toLowerCase().includes(term),
    )
  }

  editarAnuncio(id: number): void {
    this.router.navigate(["/editar-anuncio", id])
  }

  excluirAnuncio(id: number): void {
    if (confirm("Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.")) {
      this.mockDataService.deleteLocal(id)

      this.carregarAnuncios()

      this.successMessage = "Anúncio excluído com sucesso!"

      setTimeout(() => {
        this.successMessage = null
      }, 5000)
    }
  }


  getLocacaoText(local: Local): string {
    if (local.tipo_locacao === "hora") {
      return `/Hora`
    } else if (local.tipo_locacao === "dia") {
      return `/Dia`
    } else if (local.tipo_locacao === "semana") {
      return `/Semana`
    } else if (local.tipo_locacao === "mes") {
      return `/Mês`
    }
    return ""
  }

  getCategoriaName(tipoLocal: string): string {
    const categoria = this.mockDataService.getCategorias().find((c) => c.id === tipoLocal)
    return categoria ? categoria.name : tipoLocal
  }

  irParaNovoAnuncio(): void {
    this.router.navigate(["/criar-anuncio"])
  }

  irParaLogin(): void {
    this.router.navigate(["/login"])
  }

  irParaRegistro(): void {
    this.router.navigate(["/register"])
  }
}
