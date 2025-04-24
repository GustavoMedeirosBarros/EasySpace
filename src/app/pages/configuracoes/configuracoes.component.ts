import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empresa } from '../../models/Empresa';
import { Usuario } from '../../models/Usuario';
import { MockDataService } from '../../services/mock.dados.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent {
  currentUser: Usuario | Empresa | null = null
  isEmpresa = false
  isLoading = true
  activeTab = "perfil"

  perfilForm!: FormGroup
  senhaForm!: FormGroup
  notificacoesForm!: FormGroup
  privacidadeForm!: FormGroup

  successMessage: string | null = null
  errorMessage: string | null = null

  isSubmittingPerfil = false
  isSubmittingSenha = false
  isSubmittingNotificacoes = false
  isSubmittingPrivacidade = false

  notificacaoOpcoes = [
    { id: "email", label: "Receber notificações por e-mail" },
    { id: "sistema", label: "Notificações do sistema" },
    { id: "reservas", label: "Atualizações de reservas" },
    { id: "mensagens", label: "Novas mensagens" },
    { id: "favoritos", label: "Quando alguém favoritar seu anúncio" },
    { id: "avaliacoes", label: "Novas avaliações" },
    { id: "marketing", label: "Novidades e promoções" },
  ]

  privacidadeOpcoes = [
    { id: "perfil_publico", label: "Perfil público" },
    { id: "mostrar_contato", label: "Mostrar informações de contato" },
    { id: "historico_busca", label: "Salvar histórico de busca" },
    { id: "cookies", label: "Aceitar cookies" },
    { id: "localizacao", label: "Compartilhar localização" },
  ]

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      if (!status) {
        this.router.navigate(["/login"], {
          queryParams: {
            redirect: "configuracoes",
            message: "Você precisa estar logado para acessar as configurações",
          },
        })
        return
      }
      this.carregarDadosUsuario()
    })

  }

  carregarDadosUsuario(): void {
    this.isLoading = true

    this.currentUser = this.authService.currentUser
    this.isEmpresa = this.authService.isEmpresa()

    if (!this.currentUser) {
      this.isLoading = false
      return
    }

    this.inicializarFormularios()

    this.isLoading = false
  }

  inicializarFormularios(): void {
    if (!this.currentUser) return

    if (this.isEmpresa) {
      const empresa = this.currentUser as Empresa

      this.perfilForm = this.fb.group({
        nome_empresa: [empresa.nome_empresa, [Validators.required]],
        email_empresa: [empresa.email_empresa, [Validators.required, Validators.email]],
        cnpj: [empresa.cnpj, [Validators.required]],
        telefone_empresa: [empresa.telefone_empresa || ""],
        celular_empresa: [empresa.celular_empresa || ""],
        cep: [empresa.cep || ""],
        cidade_empresa: [empresa.cidade_empresa || ""],
        estado_empresa: [empresa.estado_empresa || ""],
      })
    } else {
      const usuario = this.currentUser as Usuario

      this.perfilForm = this.fb.group({
        nome_usuario: [usuario.nome_usuario, [Validators.required]],
        email_usuario: [usuario.email_usuario, [Validators.required, Validators.email]],
        cpf: [usuario.cpf, [Validators.required]],
        data_nascimento: [this.formatarDataParaInput(usuario.data_nascimento), [Validators.required]],
        telefone_usuario: [usuario.telefone_usuario || ""],
        celular_usuario: [usuario.celular_usuario || ""],
        cep: [usuario.cep || ""],
        cidade_usuario: [usuario.cidade_usuario || ""],
        estado_usuario: [usuario.estado_usuario || ""],
      })
    }

    this.senhaForm = this.fb.group(
      {
        senha_atual: ["", [Validators.required, Validators.minLength(6)]],
        nova_senha: ["", [Validators.required, Validators.minLength(6)]],
        confirmar_senha: ["", [Validators.required]],
      },
      { validators: this.senhasIguaisValidator },
    )

    this.notificacoesForm = this.fb.group({
      email: [true],
      sistema: [true],
      reservas: [true],
      mensagens: [true],
      favoritos: [true],
      avaliacoes: [true],
      marketing: [false],
    })

    this.privacidadeForm = this.fb.group({
      perfil_publico: [true],
      mostrar_contato: [true],
      historico_busca: [true],
      cookies: [true],
      localizacao: [false],
    })
  }

  formatarDataParaInput(data: Date): string {
    if (!data) return "";

    const dateObj = typeof data === 'string' ? new Date(data) : data;

    if (isNaN(dateObj.getTime())) return "";

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get("nova_senha")?.value
    const confirmarSenha = form.get("confirmar_senha")?.value

    if (senha !== confirmarSenha) {
      form.get("confirmar_senha")?.setErrors({ senhasDiferentes: true })
      return { senhasDiferentes: true }
    }

    return null
  }

  mudarTab(tab: string): void {
    this.activeTab = tab
    this.successMessage = null
    this.errorMessage = null
  }

  salvarPerfil(): void {
    if (this.perfilForm.invalid) {
      Object.keys(this.perfilForm.controls).forEach((key) => {
        this.perfilForm.get(key)?.markAsTouched()
      })
      return
    }

    this.isSubmittingPerfil = true

    setTimeout(() => {
      if (!this.currentUser) {
        this.errorMessage = "Erro ao salvar perfil. Usuário não encontrado."
        this.isSubmittingPerfil = false
        return
      }

      try {
        const formData = this.perfilForm.value

        if (this.isEmpresa) {
          const empresa = this.currentUser as Empresa

          empresa.nome_empresa = formData.nome_empresa
          empresa.email_empresa = formData.email_empresa
          empresa.cnpj = formData.cnpj
          empresa.telefone_empresa = formData.telefone_empresa
          empresa.celular_empresa = formData.celular_empresa
          empresa.cep = formData.cep
          empresa.cidade_empresa = formData.cidade_empresa
          empresa.estado_empresa = formData.estado_empresa

          this.mockDataService.updateEmpresa(empresa)
        } else {
          const usuario = this.currentUser as Usuario

          usuario.nome_usuario = formData.nome_usuario
          usuario.email_usuario = formData.email_usuario
          usuario.cpf = formData.cpf
          usuario.data_nascimento = new Date(formData.data_nascimento)
          usuario.telefone_usuario = formData.telefone_usuario
          usuario.celular_usuario = formData.celular_usuario
          usuario.cep = formData.cep
          usuario.cidade_usuario = formData.cidade_usuario
          usuario.estado_usuario = formData.estado_usuario

          this.mockDataService.updateUsuario(usuario)
        }

        this.authService.updateCurrentUser(this.currentUser)

        this.successMessage = "Perfil atualizado com sucesso!"
      } catch (error) {
        this.errorMessage = "Erro ao salvar perfil. Tente novamente."
      }

      this.isSubmittingPerfil = false
    }, 1000)
  }

  alterarSenha(): void {
    if (this.senhaForm.invalid) {
      Object.keys(this.senhaForm.controls).forEach((key) => {
        this.senhaForm.get(key)?.markAsTouched()
      })
      return
    }

    this.isSubmittingSenha = true

    setTimeout(() => {
      if (!this.currentUser) {
        this.errorMessage = "Erro ao alterar senha. Usuário não encontrado."
        this.isSubmittingSenha = false
        return
      }

      try {
        const formData = this.senhaForm.value

        if (this.isEmpresa) {
          const empresa = this.currentUser as Empresa
          if (empresa.senha_empresa !== formData.senha_atual) {
            this.errorMessage = "Senha atual incorreta."
            this.isSubmittingSenha = false
            return
          }

          empresa.senha_empresa = formData.nova_senha

          this.mockDataService.updateEmpresa(empresa)
        } else {
          const usuario = this.currentUser as Usuario
          if (usuario.senha_usuario !== formData.senha_atual) {
            this.errorMessage = "Senha atual incorreta."
            this.isSubmittingSenha = false
            return
          }

          usuario.senha_usuario = formData.nova_senha

          this.mockDataService.updateUsuario(usuario)
        }

        this.successMessage = "Senha alterada com sucesso!"
        this.senhaForm.reset()
      } catch (error) {
        this.errorMessage = "Erro ao alterar senha. Tente novamente."
      }

      this.isSubmittingSenha = false
    }, 1000)
  }

  salvarNotificacoes(): void {
    this.isSubmittingNotificacoes = true

    setTimeout(() => {
      this.successMessage = "Preferências de notificação salvas com sucesso!"
      this.isSubmittingNotificacoes = false
    }, 1000)
  }

  salvarPrivacidade(): void {
    this.isSubmittingPrivacidade = true

    setTimeout(() => {
      this.successMessage = "Configurações de privacidade salvas com sucesso!"
      this.isSubmittingPrivacidade = false
    }, 1000)
  }

  excluirConta(): void {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      alert("Funcionalidade não implementada nesta versão de demonstração.")
    }
  }

  consultaCep(): void {
    let cep = ""

    if (this.isEmpresa) {
      cep = this.perfilForm.get("cep")?.value
    } else {
      cep = this.perfilForm.get("cep")?.value
    }

    if (cep && cep.length >= 8) {
      setTimeout(() => {
        if (this.isEmpresa) {
          this.perfilForm.patchValue({
            cidade_empresa: "Sorocaba",
            estado_empresa: "SP",
          })
        } else {
          this.perfilForm.patchValue({
            cidade_usuario: "Sorocaba",
            estado_usuario: "SP",
          })
        }
      }, 800)
    }
  }
}
