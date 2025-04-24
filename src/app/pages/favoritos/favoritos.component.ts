import { Component, OnInit } from '@angular/core';
import { Local } from '../../models/Local';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favoritos',
  imports: [CommonModule, RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {
  locaisFavoritos: Local[] = []
  isLoading = true
  isLoggedIn = false

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (status) {
        this.carregarFavoritos()
      } else {
        this.isLoading = false
      }
    })
  }

  carregarFavoritos(): void {
    this.isLoading = true

    const usuario = this.authService.getCurrentUsuario()
    if (!usuario) {
      this.isLoading = false
      return
    }

    this.locaisFavoritos = this.mockDataService.getLocaisFavoritos(usuario.id_usuario)
    this.isLoading = false
  }

  removerFavorito(local: Local, event: Event): void {
    event.preventDefault()
    event.stopPropagation()

    const usuario = this.authService.getCurrentUsuario()
    if (!usuario) return

    this.mockDataService.removeFavorito(local.id_local, usuario.id_usuario)

    this.locaisFavoritos = this.locaisFavoritos.filter((l) => l.id_local !== local.id_local)
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

  irParaLogin(): void {
    this.router.navigate(["/login"])
  }

  irParaRegistro(): void {
    this.router.navigate(["/register"])
  }
}
