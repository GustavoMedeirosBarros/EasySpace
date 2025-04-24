export interface Local {
    id_local: number
    nome_local: string
    imagem_local: string
    cep: string
    cidade_local: string
    estado_local: string
    endereco_local: string
    numero_local: string
    celular_local: string
    descricao_local: string
    valor: number
    tipo_local: string // tipo de local como evento, sala, etc
    tipo_locacao: string // tipo de locacao como diaria, mensal, etc
    data_disponibilidade: Date
    avaliacao: number
    id_empresa: number
    id_usuario: number
    latitude?: number
    longitude?: number
    comodidades?: string[]
}
