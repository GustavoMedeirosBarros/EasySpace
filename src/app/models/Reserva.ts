export interface Reserva {
    id_reserva: number
    id_local: number
    id_usuario: number
    data_inicio: Date
    data_fim: Date
    horario_inicio?: string
    horario_fim?: string
    valor_total: number
    status: "pendente" | "confirmada" | "cancelada" | "concluida"
    data_reserva: Date
    quantidade_pessoas: number
    observacoes?: string
    metodo_pagamento: string
}

export interface DadosPagamento {
    numero_cartao: string
    nome_titular: string
    validade: string
    cvv: string
    parcelas: number
}
