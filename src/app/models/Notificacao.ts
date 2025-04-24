export type TipoNotificacao = "sistema" | "reserva" | "mensagem" | "favorito" | "avaliacao"

export interface Notificacao {
    id_notificacao: number
    id_usuario?: number
    id_empresa?: number
    titulo: string
    mensagem: string
    data_notificacao: Date
    lida: boolean
    tipo: TipoNotificacao
    link?: string
    icone?: string
}
