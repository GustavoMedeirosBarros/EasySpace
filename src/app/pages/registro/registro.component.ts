import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RegisterEmpresaData, RegisterUsuarioData, UserType } from '../../models/Auth';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registerForm!: FormGroup
  errorMessage = ""
  isLoading = false
  selectedUserType: UserType = "usuario"
  userTypes: { value: UserType; label: string }[] = [
    { value: "usuario", label: "Usuário" },
    { value: "empresa", label: "Empresa" },
  ]

  redirectAction: string | null = null
  redirectLocalId: number | null = null

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.redirectAction = params["redirect"] || null
      this.redirectLocalId = params["localId"] ? +params["localId"] : null
    })
  }

  createForm(): void {
    const commonFields = {
      tipoUsuario: [this.selectedUserType, [Validators.required]],
      senha: ["", [Validators.required, Validators.minLength(6)]],
      confirmSenha: ["", [Validators.required]],
      cep: [""],
      celular: [""],
      telefone: [""],
      terms: [false, [Validators.requiredTrue]],
    }

    if (this.selectedUserType === "usuario") {
      this.registerForm = this.fb.group(
        {
          ...commonFields,
          nome_usuario: ["", [Validators.required]],
          email_usuario: ["", [Validators.required, Validators.email]],
          cpf: ["", [Validators.required]],
          data_nascimento: ["", [Validators.required]],
          cidade_usuario: [""],
          estado_usuario: [""],
        },
        {
          validators: this.passwordMatchValidator,
        },
      )
    } else {
      this.registerForm = this.fb.group(
        {
          ...commonFields,
          nome_empresa: ["", [Validators.required]],
          email_empresa: ["", [Validators.required, Validators.email]],
          cnpj: ["", [Validators.required]],
          cidade_empresa: [""],
          estado_empresa: [""],
        },
        {
          validators: this.passwordMatchValidator,
        },
      )
    }
  }

  onUserTypeChange(userType: UserType): void {
    this.selectedUserType = userType
    this.createForm()
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("senha")?.value
    const confirmPassword = form.get("confirmSenha")?.value

    if (password !== confirmPassword) {
      form.get("confirmSenha")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    setTimeout(() => {
      if (this.selectedUserType === "usuario") {
        const userData: RegisterUsuarioData = {
          nome_usuario: this.registerForm.value.nome_usuario,
          email_usuario: this.registerForm.value.email_usuario,
          senha_usuario: this.registerForm.value.senha,
          cpf: this.registerForm.value.cpf,
          data_nascimento: this.registerForm.value.data_nascimento,
          celular_usuario: this.registerForm.value.celular,
          telefone_usuario: this.registerForm.value.telefone,
          cep: this.registerForm.value.cep,
          cidade_usuario: this.registerForm.value.cidade_usuario,
          estado_usuario: this.registerForm.value.estado_usuario,
        }

        this.authService
          .registerUsuario(userData)
          .then(() => {
            this.handleRedirectAfterRegister()
          })
          .catch((error) => {
            this.errorMessage = error.message || "Falha ao criar conta. Tente novamente."
          })
          .finally(() => {
            this.isLoading = false
          })
      } else {
        const empresaData: RegisterEmpresaData = {
          nome_empresa: this.registerForm.value.nome_empresa,
          email_empresa: this.registerForm.value.email_empresa,
          senha_empresa: this.registerForm.value.senha,
          cnpj: this.registerForm.value.cnpj,
          celular_empresa: this.registerForm.value.celular,
          telefone_empresa: this.registerForm.value.telefone,
          cep: this.registerForm.value.cep,
          cidade_empresa: this.registerForm.value.cidade_empresa,
          estado_empresa: this.registerForm.value.estado_empresa,
        }

        this.authService
          .registerEmpresa(empresaData)
          .then(() => {
            this.handleRedirectAfterRegister()
          })
          .catch((error) => {
            this.errorMessage = error.message || "Falha ao criar conta. Tente novamente."
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }, 1000)
  }

  handleRedirectAfterRegister(): void {
    if (this.redirectAction === "favorito" && this.redirectLocalId) {
      this.router.navigate(["/local", this.redirectLocalId])
    } else {
      this.router.navigate(["/"])
    }
  }
}
