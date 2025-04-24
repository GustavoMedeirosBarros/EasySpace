import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import type { Usuario } from "../models/Usuario"
import type { Empresa } from "../models/Empresa"
import type { UserType, AuthResponse, RegisterUsuarioData, RegisterEmpresaData } from "../models/Auth"
import { MockDataService } from "./mock.dados.service"

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<Usuario | Empresa | null>(null)
    public currentUser$ = this.currentUserSubject.asObservable()

    private userTypeSubject = new BehaviorSubject<UserType | null>(null)
    public userType$ = this.userTypeSubject.asObservable()

    private isLoggedInSubject = new BehaviorSubject<boolean>(false)
    public isLoggedIn$ = this.isLoggedInSubject.asObservable()

    constructor(private mockDataService: MockDataService) {
        const storedUser = localStorage.getItem("currentUser")
        const storedUserType = localStorage.getItem("userType") as UserType | null

        if (storedUser && storedUserType) {
            const user = JSON.parse(storedUser)
            this.currentUserSubject.next(user)
            this.userTypeSubject.next(storedUserType)
            this.isLoggedInSubject.next(true)
        }
    }

    async login(credentials: { email: string; senha: string }): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            const usuario = this.mockDataService.authenticateUsuario(credentials.email, credentials.senha)

            if (usuario) {
                const authResponse: AuthResponse = {
                    token: "fake-jwt-token",
                    userType: "usuario",
                    userData: usuario,
                }

                localStorage.setItem("currentUser", JSON.stringify(usuario))
                localStorage.setItem("userType", "usuario")
                localStorage.setItem("token", authResponse.token)

                this.currentUserSubject.next(usuario)
                this.userTypeSubject.next("usuario")
                this.isLoggedInSubject.next(true)

                resolve(authResponse)
                return
            }

            const empresa = this.mockDataService.authenticateEmpresa(credentials.email, credentials.senha)

            if (empresa) {
                const authResponse: AuthResponse = {
                    token: "fake-jwt-token",
                    userType: "empresa",
                    userData: empresa,
                }

                localStorage.setItem("currentUser", JSON.stringify(empresa))
                localStorage.setItem("userType", "empresa")
                localStorage.setItem("token", authResponse.token)

                this.currentUserSubject.next(empresa)
                this.userTypeSubject.next("empresa")
                this.isLoggedInSubject.next(true)

                resolve(authResponse)
                return
            }

            reject({ message: "Email ou senha inválidos" })
        })
    }

    async registerUsuario(data: RegisterUsuarioData): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            if (this.mockDataService.emailExists(data.email_usuario)) {
                reject({ message: "Este email já está em uso" })
                return
            }

            const userData: Usuario = {
                id_usuario: 0,
                nome_usuario: data.nome_usuario,
                email_usuario: data.email_usuario,
                senha_usuario: data.senha_usuario,
                cpf: data.cpf,
                data_nascimento: data.data_nascimento,
                celular_usuario: data.celular_usuario || "",
                telefone_usuario: data.telefone_usuario || "",
                cep: data.cep || "",
                cidade_usuario: data.cidade_usuario || "",
                estado_usuario: data.estado_usuario || "",
            }

            this.mockDataService.addUsuario(userData)

            const authResponse: AuthResponse = {
                token: "fake-jwt-token",
                userType: "usuario",
                userData: userData,
            }

            localStorage.setItem("currentUser", JSON.stringify(userData))
            localStorage.setItem("userType", "usuario")
            localStorage.setItem("token", authResponse.token)

            this.currentUserSubject.next(userData)
            this.userTypeSubject.next("usuario")
            this.isLoggedInSubject.next(true)

            resolve(authResponse)
        })
    }

    async registerEmpresa(data: RegisterEmpresaData): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            if (this.mockDataService.emailExists(data.email_empresa)) {
                reject({ message: "Este email já está em uso" })
                return
            }

            const userData: Empresa = {
                id_empresa: 0,
                nome_empresa: data.nome_empresa,
                email_empresa: data.email_empresa,
                senha_empresa: data.senha_empresa,
                cnpj: data.cnpj,
                celular_empresa: data.celular_empresa || "",
                telefone_empresa: data.telefone_empresa || "",
                cep: data.cep || "",
                cidade_empresa: data.cidade_empresa || "",
                estado_empresa: data.estado_empresa || "",
            }

            this.mockDataService.addEmpresa(userData)

            const authResponse: AuthResponse = {
                token: "fake-jwt-token",
                userType: "empresa",
                userData: userData,
            }

            localStorage.setItem("currentUser", JSON.stringify(userData))
            localStorage.setItem("userType", "empresa")
            localStorage.setItem("token", authResponse.token)

            this.currentUserSubject.next(userData)
            this.userTypeSubject.next("empresa")
            this.isLoggedInSubject.next(true)

            resolve(authResponse)
        })
    }

    logout(): void {
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userType")
        localStorage.removeItem("token")
        this.currentUserSubject.next(null)
        this.userTypeSubject.next(null)
        this.isLoggedInSubject.next(false)
    }

    get currentUser(): Usuario | Empresa | null {
        return this.currentUserSubject.value
    }

    get userType(): UserType | null {
        return this.userTypeSubject.value
    }

    get isLoggedIn(): boolean {
        return this.isLoggedInSubject.value
    }

    isUsuario(): boolean {
        return this.userType === "usuario"
    }

    isEmpresa(): boolean {
        return this.userType === "empresa"
    }

    getCurrentUsuario(): Usuario | null {
        if (this.isUsuario()) {
            return this.currentUser as Usuario
        }
        return null
    }

    getCurrentEmpresa(): Empresa | null {
        if (this.isEmpresa()) {
            return this.currentUser as Empresa
        }
        return null
    }
    updateCurrentUser(user: Usuario | Empresa | null): void {
        if (user) {
            this.currentUserSubject.next(user)
            localStorage.setItem("currentUser", JSON.stringify(user))
        }
    }
}
