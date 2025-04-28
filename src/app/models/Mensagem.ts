export interface Mensagem {
    id_mensagem: number
    id_conversa: number
    id_remetente: number
    is_remetente_usuario: boolean
    conteudo: string
    data_envio: Date
    lida: boolean
    tipo: "texto" | "imagem" | "arquivo"
    url_anexo?: string
}

export interface Conversa {
    id_conversa: number
    id_usuario: number
    id_empresa?: number
    id_local: number
    id_reserva?: number
    titulo: string
    ultima_mensagem?: string
    data_ultima_mensagem?: Date
    nao_lidas_usuario: number
    nao_lidas_empresa: number
}
