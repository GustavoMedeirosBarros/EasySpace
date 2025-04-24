export interface Comentario {
    id_comentario: number
    id_local: number
    id_usuario: number
    nome_usuario: string
    foto_usuario: string
    avaliacao: number
    texto: string
    data_comentario: Date
}
