import type { Usuario } from "./Usuario"
import type { Empresa } from "./Empresa"

export type UserType = "usuario" | "empresa"

export interface AuthResponse {
    token: string
    userType: UserType
    userData: Usuario | Empresa
}

export interface LoginCredentials {
    email: string
    senha: string
    tipoUsuario: UserType
}

export interface RegisterUsuarioData {
    nome_usuario: string
    email_usuario: string
    senha_usuario: string
    cpf: string
    data_nascimento: Date
    celular_usuario?: string
    telefone_usuario?: string
    cep?: string
    cidade_usuario?: string
    estado_usuario?: string
}

export interface RegisterEmpresaData {
    nome_empresa: string
    email_empresa: string
    senha_empresa: string
    cnpj: string
    celular_empresa?: string
    telefone_empresa?: string
    cep?: string
    cidade_empresa?: string
    estado_empresa?: string
}
