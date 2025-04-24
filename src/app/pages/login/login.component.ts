import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  errorMessage = ""
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      senha: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    const credentials = {
      email: this.loginForm.value.email,
      senha: this.loginForm.value.senha,
    }
    setTimeout(() => {
      this.authService
        .login(credentials)
        .then(() => {
          this.router.navigate(["/"])
        })
        .catch((error) => {
          this.errorMessage = error.message || "Falha ao fazer login. Verifique suas credenciais."
        })
        .finally(() => {
          this.isLoading = false
        })
    }, 1000)
  }
}
