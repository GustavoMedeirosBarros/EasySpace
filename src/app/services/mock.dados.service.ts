import { Injectable } from "@angular/core"
import type { Local } from "../models/Local"
import type { Usuario } from "../models/Usuario"
import type { Empresa } from "../models/Empresa"
import { Comentario } from "../models/Comentario"
import { Favorito } from "../models/Favoritos"
import { Notificacao } from "../models/Notificacao"
import { BehaviorSubject } from "rxjs"
import { Reserva } from "../models/Reserva"

@Injectable({
    providedIn: "root",
})
export class MockDataService {
    private notificacoesChangedSubject = new BehaviorSubject<boolean>(false)
    public notificacoesChanged$ = this.notificacoesChangedSubject.asObservable()

    private _usuarios: Usuario[] = [
        {
            id_usuario: 1,
            nome_usuario: "João Silva",
            email_usuario: "joao@example.com",
            senha_usuario: "123456",
            cpf: "123.456.789-00",
            data_nascimento: new Date("1990-01-01"),
            celular_usuario: "(15) 99999-9999",
            telefone_usuario: "(15) 3333-3333",
            cep: "18000-000",
            cidade_usuario: "Sorocaba",
            estado_usuario: "SP",
            foto_perfil: ""
        },
        {
            id_usuario: 2,
            nome_usuario: "Maria Oliveira",
            email_usuario: "maria@example.com",
            senha_usuario: "123456",
            cpf: "987.654.321-00",
            data_nascimento: new Date("1992-05-15"),
            celular_usuario: "(15) 99999-8888",
            telefone_usuario: "(15) 3333-2222",
            cep: "18000-000",
            cidade_usuario: "Sorocaba",
            estado_usuario: "SP",
            foto_perfil: ""
        },
    ]

    private _empresas: Empresa[] = [
        {
            id_empresa: 1,
            nome_empresa: "Empresa ABC",
            email_empresa: "contato@abc.com",
            senha_empresa: "123456",
            cnpj: "12.345.678/0001-90",
            celular_empresa: "(15) 99999-7777",
            telefone_empresa: "(15) 3333-4444",
            cep: "18000-000",
            cidade_empresa: "Sorocaba",
            estado_empresa: "SP",
            foto_perfil: ""
        },
        {
            id_empresa: 2,
            nome_empresa: "Empresa XYZ",
            email_empresa: "contato@xyz.com",
            senha_empresa: "123456",
            cnpj: "98.765.432/0001-10",
            celular_empresa: "(15) 99999-6666",
            telefone_empresa: "(15) 3333-5555",
            cep: "18000-000",
            cidade_empresa: "Sorocaba",
            estado_empresa: "SP",
            foto_perfil: ""
        },
    ]

    private _locais: Local[] = [
        {
            id_local: 1,
            nome_local: "Local para reuniões",
            imagem_local: "reuniao.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Av. Itavuvu",
            numero_local: "3367",
            celular_local: "(15) 99999-9999",
            descricao_local: "Espaço reservado para reuniões, com capacidade para até 20 pessoas. Ambiente equipado com:\n• Mesas e cadeiras confortáveis;\n• Projetor e TV para apresentações;\n• Wi-Fi de alta velocidade;\n• Ar-condicionado;\n• Serviço de café e água disponível.\nLocalização de fácil acesso, ideal para encontros corporativos, treinamentos ou reuniões de equipe.",
            valor: 100.0,
            tipo_local: "coworking e escritorios",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 5.0,
            id_empresa: 1,
            id_usuario: 0,
            latitude: -23.4661,
            longitude: -47.4785,
            comodidades: ["wifi", "ar-condicionado", "projetor", "cafe"],
        },
        {
            id_local: 2,
            nome_local: "Chácara",
            imagem_local: "chacara.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "R. das Pedreiras",
            numero_local: "500",
            celular_local: "(15) 99999-8888",
            descricao_local: "Chácara espaçosa para eventos com área verde ampla, piscina, churrasqueira e salão de festas. Capacidade para até 100 pessoas.\n• Piscina grande com área de lazer;\n• Churrasqueira completa;\n• Cozinha equipada;\n• Estacionamento para 20 carros;\n• Área verde para atividades ao ar livre.",
            valor: 1000.0,
            tipo_local: "terrenos e areas externas",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 5.0,
            id_empresa: 0,
            id_usuario: 1,
            latitude: -23.519176476501745,
            longitude: -47.42230164004116,
            comodidades: ["piscina", "churrasqueira", "estacionamento", "wifi"],
        },
        {
            id_local: 3,
            nome_local: "Salão de festas infantil",
            imagem_local: "salao_festas.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "R. Alameda Santos",
            numero_local: "789",
            celular_local: "(15) 99999-7777",
            descricao_local: "Salão decorado para festas infantis com brinquedos, piscina de bolinhas e área para buffet.\n• Decoração temática personalizável;\n• Brinquedos e jogos para crianças;\n• Sistema de som incluso;\n• Cozinha equipada para buffet;\n• Mesas e cadeiras para até 50 convidados.",
            valor: 400.0,
            tipo_local: "eventos e cultura",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 5.0,
            id_empresa: 2,
            id_usuario: 0,
            latitude: -23.480596770950545,
            longitude: -47.43322715143828,
            comodidades: ["ar-condicionado", "som", "wifi", "estacionamento"],
        },
        {
            id_local: 4,
            nome_local: "Quiosque condomínio",
            imagem_local: "quiosque.jpeg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua Pombal Ruggeri",
            numero_local: "456",
            celular_local: "(15) 99999-6666",
            descricao_local: "Área de lazer em condomínio com churrasqueira, piscina e espaço para eventos.\n• Churrasqueira com utensílios;\n• Piscina com espreguiçadeiras;\n• Mesas e cadeiras para até 30 pessoas;\n• Banheiros exclusivos;\n• Segurança 24h.",
            valor: 200.0,
            tipo_local: "terrenos e areas externas",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 5.0,
            id_empresa: 0,
            id_usuario: 2,
            latitude: -23.495673923826093,
            longitude: -47.47017556135218,
            comodidades: ["piscina", "churrasqueira", "seguranca"],
        },
        {
            id_local: 5,
            nome_local: "Salão de eventos",
            imagem_local: "salao_eventos.jpeg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Av. Central",
            numero_local: "1000",
            celular_local: "(15) 99999-5555",
            descricao_local: "Salão para eventos corporativos com estrutura completa para palestras e conferências.\n• Sistema de som e iluminação profissional;\n• Projetor e telão;\n• Palco para apresentações;\n• Ar-condicionado central;\n• Capacidade para 200 pessoas sentadas.",
            valor: 600.0,
            tipo_local: "eventos e cultura",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 5.0,
            id_empresa: 3,
            id_usuario: 0,
            latitude: -23.4915,
            longitude: -47.4426,
            comodidades: ["ar-condicionado", "som", "projetor", "wifi", "estacionamento"],
        },
        {
            id_local: 6,
            nome_local: "Salão de eventos",
            imagem_local: "salao_eventos_2.jpeg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua das Palmeiras",
            numero_local: "222",
            celular_local: "(15) 99999-4444",
            descricao_local: "Salão moderno para eventos sociais e corporativos com decoração elegante.\n• Ambiente climatizado;\n• Iluminação especial;\n• Cozinha industrial completa;\n• Estacionamento com manobrista;\n• Capacidade para 150 convidados.",
            valor: 800.0,
            tipo_local: "eventos e cultura",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 4.8,
            id_empresa: 0,
            id_usuario: 3,
            latitude: -23.5315,
            longitude: -47.4826,
            comodidades: ["ar-condicionado", "estacionamento", "wifi", "cozinha"],
        },
        {
            id_local: 7,
            nome_local: "Salão festas condomínio",
            imagem_local: "salao_festas_condominio.png",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua dos Pinheiros",
            numero_local: "333",
            celular_local: "(15) 99999-3333",
            descricao_local: "Salão de festas em condomínio fechado com segurança e privacidade.\n• Churrasqueira e forno de pizza;\n• Cozinha equipada;\n• Sistema de som ambiente;\n• Mesas e cadeiras para 40 pessoas;\n• Banheiros masculino e feminino.",
            valor: 300.0,
            tipo_local: "eventos e cultura",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 4.9,
            id_empresa: 4,
            id_usuario: 0,
            latitude: -23.5415,
            longitude: -47.4926,
            comodidades: ["churrasqueira", "som", "cozinha", "seguranca"],
        },
        {
            id_local: 8,
            nome_local: "Galpão de reservas",
            imagem_local: "galpao.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Av. Industrial",
            numero_local: "1500",
            celular_local: "(15) 99999-2222",
            descricao_local: "Galpão amplo para eventos de grande porte, feiras e exposições.\n• Área total de 500m²;\n• Pé direito alto;\n• Estacionamento para 50 veículos;\n• Banheiros com acessibilidade;\n• Entrada independente para carga e descarga.",
            valor: 1200.0,
            tipo_local: "comercial",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 4.8,
            id_empresa: 0,
            id_usuario: 4,
            latitude: -23.5515,
            longitude: -47.5026,
            comodidades: ["estacionamento", "acessibilidade"],
        },
        {
            id_local: 9,
            nome_local: "Quadra esportiva",
            imagem_local: "quadra.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua dos Esportes",
            numero_local: "100",
            celular_local: "(15) 99999-1111",
            descricao_local: "Quadra poliesportiva coberta para prática de diversos esportes.\n• Piso emborrachado profissional;\n• Iluminação adequada para jogos noturnos;\n• Vestiários com chuveiros;\n• Arquibancada para 50 pessoas;\n• Equipamentos esportivos disponíveis.",
            valor: 120.0,
            tipo_local: "esportivos",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 5.0,
            id_empresa: 5,
            id_usuario: 0,
            latitude: -23.5615,
            longitude: -47.5126,
            comodidades: ["vestiario", "estacionamento"],
        },
        {
            id_local: 10,
            nome_local: "Quiosque para eventos",
            imagem_local: "quiosques_eventos.jpeg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Parque da Cidade",
            numero_local: "s/n",
            celular_local: "(15) 99999-0000",
            descricao_local: "Quiosque em área verde para pequenos eventos e confraternizações.\n• Churrasqueira com utensílios;\n• Mesas e bancos de madeira;\n• Iluminação para eventos noturnos;\n• Área verde ao redor;\n• Estacionamento próximo.",
            valor: 250.0,
            tipo_local: "residencial",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 4.7,
            id_empresa: 0,
            id_usuario: 5,
            latitude: -23.5715,
            longitude: -47.5226,
            comodidades: ["churrasqueira", "estacionamento"],
        },
        {
            id_local: 11,
            nome_local: "Sala de reuniões executiva",
            imagem_local: "executiva.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Centro Empresarial",
            numero_local: "1200",
            celular_local: "(15) 98888-7777",
            descricao_local: "Sala de reuniões com equipamentos audiovisuais de última geração.\n• Mesa de reunião para 12 pessoas;\n• Smart TV 65 polegadas;\n• Sistema de videoconferência;\n• Wi-Fi de alta velocidade;\n• Serviço de café e água mineral.",
            valor: 180.0,
            tipo_local: "coworking e escritorios",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 4.9,
            id_empresa: 6,
            id_usuario: 0,
            latitude: -23.5815,
            longitude: -47.5326,
            comodidades: ["wifi", "ar-condicionado", "projetor", "cafe"],
        },
        {
            id_local: 12,
            nome_local: "Chácara com piscina",
            imagem_local: "chacara_piscina.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Estrada Rural",
            numero_local: "km 5",
            celular_local: "(15) 98888-6666",
            descricao_local: "Chácara com piscina, churrasqueira e campo para eventos ao ar livre.\n• Piscina grande com cascata;\n• Churrasqueira completa;\n• Campo de futebol gramado;\n• Salão de jogos;\n• Acomodação para 15 pessoas pernoitarem.",
            valor: 1500.0,
            tipo_local: "terrenos e areas externas",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 4.8,
            id_empresa: 0,
            id_usuario: 6,
            latitude: -23.5915,
            longitude: -47.5426,
            comodidades: ["piscina", "churrasqueira", "estacionamento", "wifi"],
        },
        {
            id_local: 13,
            nome_local: "Campo de Futebol Society",
            imagem_local: "futebol_society.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua dos Esportes",
            numero_local: "200",
            celular_local: "(15) 98888-5555",
            descricao_local: "Campo de futebol society com gramado sintético e iluminação noturna. Ideal para partidas com amigos ou campeonatos.\n• Gramado sintético de alta qualidade;\n• Iluminação LED para jogos noturnos;\n• Vestiários completos;\n• Arquibancada para 100 pessoas;\n• Bar e lanchonete no local.",
            valor: 200.0,
            tipo_local: "esportivos",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 4.9,
            id_empresa: 0,
            id_usuario: 7,
            latitude: -23.5015,
            longitude: -47.4626,
            comodidades: ["vestiario", "iluminacao", "bar", "estacionamento"],
        },
        {
            id_local: 14,
            nome_local: "Sala de Aula Multiuso",
            imagem_local: "sala_aula.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua da Educação",
            numero_local: "300",
            celular_local: "(15) 98888-4444",
            descricao_local: "Sala de aula equipada para cursos, palestras e workshops.\n• Capacidade para 30 pessoas;\n• Quadro branco e projetor;\n• Wi-Fi de alta velocidade;\n• Ar-condicionado;\n• Cadeiras e mesas móveis.",
            valor: 150.0,
            tipo_local: "educacionais",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 4.7,
            id_empresa: 7,
            id_usuario: 0,
            latitude: -23.5115,
            longitude: -47.4726,
            comodidades: ["wifi", "ar-condicionado", "projetor"],
        },
        {
            id_local: 15,
            nome_local: "Cozinha Industrial Compartilhada",
            imagem_local: "cozinha_industrial.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Av. Gastronômica",
            numero_local: "400",
            celular_local: "(15) 98888-3333",
            descricao_local: "Cozinha industrial equipada para eventos gastronômicos e produção de alimentos.\n• Fogões industriais;\n• Fornos profissionais;\n• Freezers e geladeiras;\n• Área de preparo ampla;\n• Licença sanitária em dia.",
            valor: 300.0,
            tipo_local: "gastronomicos",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 4.8,
            id_empresa: 0,
            id_usuario: 8,
            latitude: -23.5215,
            longitude: -47.4826,
            comodidades: ["equipamentos", "freezer", "area preparo"],
        },
        {
            id_local: 16,
            nome_local: "Armazém Logístico",
            imagem_local: "armazem.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Av. Industrial",
            numero_local: "2000",
            celular_local: "(15) 98888-2222",
            descricao_local: "Armazém para estoque e logística com 1000m² de área útil.\n• Pé direito alto;\n• Docas de carga;\n• Sistema de segurança 24h;\n• Área para escritório;\n• Facilidade de acesso para caminhões.",
            valor: 2000.0,
            tipo_local: "industrial ou logística",
            tipo_locacao: "mes",
            data_disponibilidade: new Date(),
            avaliacao: 4.6,
            id_empresa: 8,
            id_usuario: 0,
            latitude: -23.5315,
            longitude: -47.4926,
            comodidades: ["seguranca", "docas", "escritorio"],
        },
        {
            id_local: 17,
            nome_local: "Estúdio Fotográfico",
            imagem_local: "estudio_foto.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Rua das Artes",
            numero_local: "500",
            celular_local: "(15) 98888-1111",
            descricao_local: "Estúdio fotográfico profissional equipado para ensaios e produções.\n• Fundos infinitos;\n• Equipamento de iluminação profissional;\n• Espaço maquiagem;\n• Ar-condicionado;\n• Wi-Fi disponível.",
            valor: 250.0,
            tipo_local: "criativos e artisticos",
            tipo_locacao: "hora",
            data_disponibilidade: new Date(),
            avaliacao: 4.9,
            id_empresa: 0,
            id_usuario: 9,
            latitude: -23.5415,
            longitude: -47.5026,
            comodidades: ["iluminacao", "wifi", "ar-condicionado"],
        },
        {
            id_local: 18,
            nome_local: "Loja Pop-up no Shopping",
            imagem_local: "popup_shop.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Shopping Center",
            numero_local: "Loja 100",
            celular_local: "(15) 98888-0000",
            descricao_local: "Espaço para loja temporária em shopping center de alto fluxo.\n• 50m² de área;\n• Vitrine frontal;\n• Iluminação adequada;\n• Segurança 24h;\n• Localização privilegiada.",
            valor: 1500.0,
            tipo_local: "temporarios ou pop-up",
            tipo_locacao: "semana",
            data_disponibilidade: new Date(),
            avaliacao: 4.7,
            id_empresa: 9,
            id_usuario: 0,
            latitude: -23.5515,
            longitude: -47.5126,
            comodidades: ["iluminacao", "seguranca", "shopping"],
        },
        {
            id_local: 19,
            nome_local: "Centro Comunitário",
            imagem_local: "centro_comunitario.jpg",
            cep: "18000-000",
            cidade_local: "Sorocaba",
            estado_local: "SP",
            endereco_local: "Praça da Comunidade",
            numero_local: "s/n",
            celular_local: "(15) 97777-9999",
            descricao_local: "Espaço comunitário para eventos sociais e reuniões de bairro.\n• Salão para 100 pessoas;\n• Cozinha comunitária;\n• Área externa com mesas;\n• Acessibilidade;\n• Estacionamento gratuito.",
            valor: 400.0,
            tipo_local: "publicos ou comunitarios",
            tipo_locacao: "dia",
            data_disponibilidade: new Date(),
            avaliacao: 4.5,
            id_empresa: 0,
            id_usuario: 10,
            latitude: -23.5615,
            longitude: -47.5226,
            comodidades: ["acessibilidade", "estacionamento", "cozinha"],
        }
    ]

    private _comentarios: Comentario[] = [
        {
            id_comentario: 1,
            id_local: 1,
            id_usuario: 3,
            nome_usuario: "Cláudio",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto:
                "Espaço ótimo para reuniões. Ambiente muito agradável e bem equipado. A internet é rápida e o ar-condicionado funciona perfeitamente. Recomendo!",
            data_comentario: new Date(2023, 5, 15),
        },
        {
            id_comentario: 2,
            id_local: 1,
            id_usuario: 4,
            nome_usuario: "Ana",
            foto_usuario: "icon_m.png",
            avaliacao: 5,
            texto:
                "Muito bom! Utilizei para uma reunião de trabalho e todos adoraram o espaço. Equipamentos de qualidade e atendimento excelente.",
            data_comentario: new Date(2023, 6, 20),
        },
        {
            id_comentario: 3,
            id_local: 2,
            id_usuario: 5,
            nome_usuario: "Roberto",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Chácara incrível! Fizemos um evento familiar e foi perfeito. Área verde bem cuidada e piscina limpa.",
            data_comentario: new Date(2023, 7, 5),
        },
        {
            id_comentario: 4,
            id_local: 2,
            id_usuario: 6,
            nome_usuario: "Fernanda",
            foto_usuario: "icon_m.png",
            avaliacao: 4,
            texto: "Lugar muito bonito e bem cuidado. Só achei o acesso um pouco difícil, mas valeu a pena.",
            data_comentario: new Date(2023, 7, 12),
        },
        {
            id_comentario: 5,
            id_local: 3,
            id_usuario: 7,
            nome_usuario: "Patrícia",
            foto_usuario: "icon_m.png",
            avaliacao: 5,
            texto: "Fiz a festa de aniversário do meu filho e foi um sucesso! As crianças adoraram os brinquedos.",
            data_comentario: new Date(2023, 8, 3),
        },
        {
            id_comentario: 6,
            id_local: 3,
            id_usuario: 8,
            nome_usuario: "Lucas",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Excelente espaço para festas infantis. Tudo muito limpo e organizado.",
            data_comentario: new Date(2023, 8, 18),
        },
        {
            id_comentario: 7,
            id_local: 4,
            id_usuario: 9,
            nome_usuario: "Mariana",
            foto_usuario: "icon_m.png",
            avaliacao: 4,
            texto: "Área de lazer muito boa. A churrasqueira é excelente e a piscina estava limpa.",
            data_comentario: new Date(2023, 9, 2),
        },
        {
            id_comentario: 8,
            id_local: 5,
            id_usuario: 10,
            nome_usuario: "Carlos",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Realizamos um evento corporativo e tudo ocorreu perfeitamente. Estrutura completa e profissional.",
            data_comentario: new Date(2023, 9, 15),
        },
        {
            id_comentario: 9,
            id_local: 6,
            id_usuario: 11,
            nome_usuario: "Juliana",
            foto_usuario: "icon_m.png",
            avaliacao: 5,
            texto: "Salão lindo e moderno. Fiz minha festa de aniversário e todos elogiaram o espaço.",
            data_comentario: new Date(2023, 10, 5),
        },
        {
            id_comentario: 10,
            id_local: 7,
            id_usuario: 12,
            nome_usuario: "Ricardo",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Ótimo custo-benefício. O salão é bem equipado e a segurança do condomínio é um diferencial.",
            data_comentario: new Date(2023, 10, 20),
        },
        {
            id_comentario: 11,
            id_local: 8,
            id_usuario: 13,
            nome_usuario: "Camila",
            foto_usuario: "icon_m.png",
            avaliacao: 4,
            texto: "Espaço amplo e bem localizado. Realizamos uma feira de artesanato e foi um sucesso.",
            data_comentario: new Date(2023, 11, 8),
        },
        {
            id_comentario: 12,
            id_local: 9,
            id_usuario: 14,
            nome_usuario: "Felipe",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Quadra excelente! Piso de qualidade e vestiários limpos. Recomendo para prática esportiva.",
            data_comentario: new Date(2023, 11, 15),
        },
        {
            id_comentario: 13,
            id_local: 10,
            id_usuario: 15,
            nome_usuario: "Beatriz",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Lugar charmoso e aconchegante. Perfeito para pequenas comemorações ao ar livre.",
            data_comentario: new Date(2023, 0, 10),
        },
        {
            id_comentario: 14,
            id_local: 11,
            id_usuario: 16,
            nome_usuario: "Gustavo",
            foto_usuario: "icon_h.png",
            avaliacao: 5,
            texto: "Sala executiva impecável. Equipamentos modernos e ambiente profissional.",
            data_comentario: new Date(2023, 1, 5),
        },
        {
            id_comentario: 15,
            id_local: 12,
            id_usuario: 17,
            nome_usuario: "Amanda",
            foto_usuario: "icon_m.png",
            avaliacao: 5,
            texto: "Chácara maravilhosa! A piscina é ótima e o campo de futebol foi o ponto alto para as crianças.",
            data_comentario: new Date(2023, 1, 20),
        },
    ]

    private _favoritos: Favorito[] = [
        {
            id_favorito: 1,
            id_local: 2,
            id_usuario: 1,
            data_favorito: new Date(2023, 5, 10),
        },
        {
            id_favorito: 2,
            id_local: 5,
            id_usuario: 1,
            data_favorito: new Date(2023, 6, 15),
        },
        {
            id_favorito: 3,
            id_local: 8,
            id_usuario: 2,
            data_favorito: new Date(2023, 7, 20),
        },
    ]

    private _notificacoes: Notificacao[] = [
        {
            id_notificacao: 1,
            id_usuario: 1,
            titulo: "Bem-vindo ao Easy Space",
            mensagem: "Obrigado por se cadastrar! Explore os melhores espaços para seus eventos.",
            data_notificacao: new Date(new Date().setDate(new Date().getDate() - 7)),
            lida: true,
            tipo: "sistema",
            icone: "bi-bell-fill",
        },
        {
            id_notificacao: 2,
            id_usuario: 1,
            titulo: "Nova mensagem recebida",
            mensagem: "Você recebeu uma nova mensagem de Empresa ABC sobre o local 'Local para reuniões'.",
            data_notificacao: new Date(new Date().setDate(new Date().getDate() - 3)),
            lida: true,
            tipo: "mensagem",
            link: "/chat",
            icone: "bi-chat-dots-fill",
        },
        {
            id_notificacao: 3,
            id_usuario: 1,
            titulo: "Solicitação de reserva aprovada",
            mensagem: "Sua reserva para 'Chácara' foi aprovada para o dia 15/12/2023.",
            data_notificacao: new Date(new Date().setDate(new Date().getDate() - 2)),
            lida: false,
            tipo: "reserva",
            link: "/local/2",
            icone: "bi-calendar-check-fill",
        },
        {
            id_notificacao: 4,
            id_usuario: 1,
            titulo: "Novo local disponível",
            mensagem: "Um novo local foi adicionado na categoria que você segue: 'Festas'.",
            data_notificacao: new Date(new Date().setDate(new Date().getDate() - 1)),
            lida: false,
            tipo: "sistema",
            link: "/",
            icone: "bi-house-fill",
        },
        {
            id_notificacao: 5,
            id_usuario: 1,
            titulo: "Lembrete de reserva",
            mensagem: "Sua reserva para 'Salão de festas infantil' está marcada para amanhã às 14:00.",
            data_notificacao: new Date(),
            lida: false,
            tipo: "reserva",
            link: "/local/3",
            icone: "bi-alarm-fill",
        },
        {
            id_notificacao: 6,
            id_usuario: 2,
            titulo: "Bem-vindo ao Easy Space",
            mensagem: "Obrigado por se cadastrar! Explore os melhores espaços para seus eventos.",
            data_notificacao: new Date(new Date().setDate(new Date().getDate() - 5)),
            lida: true,
            tipo: "sistema",
            icone: "bi-bell-fill",
        },
        {
            id_notificacao: 7,
            id_empresa: 1,
            titulo: "Nova solicitação de reserva",
            mensagem: "Você recebeu uma nova solicitação de reserva para 'Local para reuniões'.",
            data_notificacao: new Date(new Date().setDate(new Date().getDate() - 1)),
            lida: false,
            tipo: "reserva",
            link: "/reservas",
            icone: "bi-calendar-plus-fill",
        },
        {
            id_notificacao: 8,
            id_usuario: 1,
            titulo: "Local adicionado aos favoritos",
            mensagem: "O local 'Quadra esportiva' foi adicionado aos seus favoritos.",
            data_notificacao: new Date(new Date().setHours(new Date().getHours() - 5)),
            lida: false,
            tipo: "favorito",
            link: "/favoritos",
            icone: "bi-heart-fill",
        },
        {
            id_notificacao: 9,
            id_usuario: 1,
            titulo: "Nova avaliação",
            mensagem: "Seu local 'Chácara' recebeu uma nova avaliação de 5 estrelas.",
            data_notificacao: new Date(new Date().setHours(new Date().getHours() - 2)),
            lida: false,
            tipo: "avaliacao",
            link: "/local/2",
            icone: "bi-star-fill",
        },
    ]

    private _userPosition = {
        latitude: -23.5505,
        longitude: -47.4726,
    }

    constructor() {
        this.loadFromLocalStorage()
    }

    private saveToLocalStorage(): void {
        localStorage.setItem("usuarios", JSON.stringify(this._usuarios))
        localStorage.setItem("empresas", JSON.stringify(this._empresas))
        localStorage.setItem("locais", JSON.stringify(this._locais))
        localStorage.setItem("favoritos", JSON.stringify(this._favoritos))
        localStorage.setItem("notificacoes", JSON.stringify(this._notificacoes))
        localStorage.setItem("comentarios", JSON.stringify(this._comentarios))
    }

    private loadFromLocalStorage(): void {
        const storedUsuarios = localStorage.getItem("usuarios")
        if (storedUsuarios) {
            const parsedUsuarios = JSON.parse(storedUsuarios)
            parsedUsuarios.forEach((usuario: any) => {
                if (usuario.data_nascimento) {
                    usuario.data_nascimento = new Date(usuario.data_nascimento)
                }
            })
            this._usuarios = parsedUsuarios
        }

        const storedEmpresas = localStorage.getItem("empresas")
        if (storedEmpresas) {
            this._empresas = JSON.parse(storedEmpresas)
        }

        const storedLocais = localStorage.getItem("locais")
        if (storedLocais) {
            const parsedLocais = JSON.parse(storedLocais)
            parsedLocais.forEach((local: any) => {
                if (local.data_disponibilidade) {
                    local.data_disponibilidade = new Date(local.data_disponibilidade)
                }
            })
            this._locais = parsedLocais
        }

        const storedFavoritos = localStorage.getItem("favoritos")
        if (storedFavoritos) {
            const parsedFavoritos = JSON.parse(storedFavoritos)
            parsedFavoritos.forEach((favorito: any) => {
                if (favorito.data_favorito) {
                    favorito.data_favorito = new Date(favorito.data_favorito)
                }
            })
            this._favoritos = parsedFavoritos
        }

        const storedNotificacoes = localStorage.getItem("notificacoes")
        if (storedNotificacoes) {
            const parsedNotificacoes = JSON.parse(storedNotificacoes)
            parsedNotificacoes.forEach((notificacao: any) => {
                if (notificacao.data_notificacao) {
                    notificacao.data_notificacao = new Date(notificacao.data_notificacao)
                }
            })
            this._notificacoes = parsedNotificacoes
        }

        const storedComentarios = localStorage.getItem("comentarios")
        if (storedComentarios) {
            const parsedComentarios = JSON.parse(storedComentarios)
            parsedComentarios.forEach((comentario: any) => {
                if (comentario.data_comentario) {
                    comentario.data_comentario = new Date(comentario.data_comentario)
                }
            })
            this._comentarios = parsedComentarios
        }
    }

    getUsuarios(): Usuario[] {
        return [...this._usuarios]
    }

    getEmpresas(): Empresa[] {
        return [...this._empresas]
    }

    getLocais(): Local[] {
        return [...this._locais]
    }

    getUsuarioById(id: number): Usuario | undefined {
        return this._usuarios.find((usuario) => usuario.id_usuario === id)
    }

    getEmpresaById(id: number): Empresa | undefined {
        return this._empresas.find((empresa) => empresa.id_empresa === id)
    }

    getLocalById(id: number): Local | undefined {
        return this._locais.find((local) => local.id_local === id)
    }

    getUsuarioByEmail(email: string): Usuario | undefined {
        return this._usuarios.find((usuario) => usuario.email_usuario === email)
    }

    getEmpresaByEmail(email: string): Empresa | undefined {
        return this._empresas.find((empresa) => empresa.email_empresa === email)
    }

    addUsuario(usuario: Usuario): void {
        const newId = this._usuarios.length > 0 ? Math.max(...this._usuarios.map((u) => u.id_usuario)) + 1 : 1
        usuario.id_usuario = newId
        this._usuarios.push(usuario)
        this.saveToLocalStorage()
    }

    addEmpresa(empresa: Empresa): void {
        const newId = this._empresas.length > 0 ? Math.max(...this._empresas.map((e) => e.id_empresa)) + 1 : 1
        empresa.id_empresa = newId
        this._empresas.push(empresa)
        this.saveToLocalStorage()
    }

    addLocal(local: Local): void {
        const newId = this._locais.length > 0 ? Math.max(...this._locais.map((l) => l.id_local)) + 1 : 1
        local.id_local = newId
        this._locais.push(local)
        this.saveToLocalStorage()
    }

    emailExists(email: string): boolean {
        return (
            this._usuarios.some((u) => u.email_usuario === email) || this._empresas.some((e) => e.email_empresa === email)
        )
    }
    authenticateUsuario(email: string, senha: string): Usuario | undefined {
        return this._usuarios.find((u) => u.email_usuario === email && u.senha_usuario === senha)
    }

    authenticateEmpresa(email: string, senha: string): Empresa | undefined {
        return this._empresas.find((e) => e.email_empresa === email && e.senha_empresa === senha)
    }

    getCategorias() {
        return [
            { id: "todos", name: "Todos", icon: "bi-grid-fill" },
            { id: "eventos e cultura", name: "Eventos e Cultura", icon: "bi-calendar-event" },
            { id: "residencial", name: "Residencial", icon: "bi-house-door" },
            { id: "industrial ou logística", name: "Industrial ou Logística", icon: "bi-truck" },
            { id: "comercial", name: "Comercial", icon: "bi-shop" },
            { id: "temporarios ou pop-up", name: "Temporários ou Pop-up", icon: "bi-clock" },
            { id: "terrenos e areas externas", name: "Terrenos e Áreas Externas", icon: "bi-pin-map" },
            { id: "coworking e escritorios", name: "Coworking e Escritórios", icon: "bi-briefcase" },
            { id: "criativos e artisticos", name: "Criativos e Artísticos", icon: "bi-palette" },
            { id: "publicos ou comunitarios", name: "Públicos ou Comunitários", icon: "bi-people" },
            { id: "esportivos", name: "Esportivos", icon: "bi-joystick" },
            { id: "educacionais", name: "Educacionais", icon: "bi-book" },
            { id: "gastronomicos", name: "Gastronômicos", icon: "bi-egg-fried" }
        ]
    }

    getComentarios(): Comentario[] {
        return [...this._comentarios]
    }

    getComentariosByLocalId(localId: number): Comentario[] {
        return this._comentarios.filter((comentario) => comentario.id_local === localId)
    }

    addComentario(comentario: Comentario): void {
        const newId = this._comentarios.length > 0 ? Math.max(...this._comentarios.map((c) => c.id_comentario)) + 1 : 1
        comentario.id_comentario = newId
        this._comentarios.push(comentario)
        this.saveToLocalStorage()

        this.updateLocalRating(comentario.id_local)

    }

    private updateLocalRating(localId: number): void {
        const comentariosLocal = this.getComentariosByLocalId(localId)
        if (comentariosLocal.length === 0) return

        const somaAvaliacoes = comentariosLocal.reduce((soma, comentario) => soma + comentario.avaliacao, 0)
        const mediaAvaliacoes = somaAvaliacoes / comentariosLocal.length

        const local = this._locais.find((l) => l.id_local === localId)
        if (local) {
            local.avaliacao = Number.parseFloat(mediaAvaliacoes.toFixed(1))
            this.saveToLocalStorage()
        }
    }

    getAvaliacaoStats(localId: number): { [key: number]: number } {
        const comentarios = this.getComentariosByLocalId(localId)
        const stats: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

        comentarios.forEach((comentario) => {
            const rating = Math.floor(comentario.avaliacao)
            if (stats[rating] !== undefined) {
                stats[rating]++
            }
        })

        return stats
    }

    getTotalLocaisByOwner(isEmpresa: boolean, ownerId: number): number {
        if (isEmpresa) {
            return this._locais.filter((local) => local.id_empresa === ownerId).length
        } else {
            return this._locais.filter((local) => local.id_usuario === ownerId).length
        }
    }

    getLocaisByOwner(isEmpresa: boolean, ownerId: number): Local[] {
        if (isEmpresa) {
            return this._locais.filter((local) => local.id_empresa === ownerId)
        } else {
            return this._locais.filter((local) => local.id_usuario === ownerId)
        }
    }

    getFavoritos(): Favorito[] {
        return [...this._favoritos]
    }

    getFavoritosByUsuario(usuarioId: number): Favorito[] {
        return this._favoritos.filter((favorito) => favorito.id_usuario === usuarioId)
    }

    getFavoritosByLocal(localId: number): Favorito[] {
        return this._favoritos.filter((favorito) => favorito.id_local === localId)
    }

    isFavorito(localId: number, usuarioId: number): boolean {
        return this._favoritos.some((favorito) => favorito.id_local === localId && favorito.id_usuario === usuarioId)
    }

    addFavorito(localId: number, usuarioId: number): Favorito {
        if (this.isFavorito(localId, usuarioId)) {
            throw new Error("Este local já está nos favoritos")
        }

        const newFavorito: Favorito = {
            id_favorito: 0,
            id_local: localId,
            id_usuario: usuarioId,
            data_favorito: new Date(),
        }

        const newId = this._favoritos.length > 0 ? Math.max(...this._favoritos.map((f) => f.id_favorito)) + 1 : 1
        newFavorito.id_favorito = newId
        this._favoritos.push(newFavorito)
        this.saveToLocalStorage()

        this.addNotificacao({
            id_notificacao: 0,
            id_usuario: usuarioId,
            titulo: "Local adicionado aos favoritos",
            mensagem: `O local "${this.getLocalById(localId)?.nome_local}" foi adicionado aos seus favoritos.`,
            data_notificacao: new Date(),
            lida: false,
            tipo: "favorito",
            link: "/favoritos",
            icone: "bi-heart-fill",
        })
        return newFavorito
    }

    removeFavorito(localId: number, usuarioId: number): void {
        const index = this._favoritos.findIndex(
            (favorito) => favorito.id_local === localId && favorito.id_usuario === usuarioId,
        )

        if (index !== -1) {
            this._favoritos.splice(index, 1)
            this.saveToLocalStorage()
        }
    }

    getLocaisFavoritos(usuarioId: number): Local[] {
        const favoritosUsuario = this.getFavoritosByUsuario(usuarioId)
        const locaisFavoritos: Local[] = []

        favoritosUsuario.forEach((favorito) => {
            const local = this.getLocalById(favorito.id_local)
            if (local) {
                locaisFavoritos.push(local)
            }
        })

        return locaisFavoritos
    }
    setUserPosition(latitude: number, longitude: number): void {
        this._userPosition.latitude = latitude
        this._userPosition.longitude = longitude
    }

    getUserPosition(): { latitude: number; longitude: number } {
        return { ...this._userPosition }
    }

    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371
        const dLat = this.deg2rad(lat2 - lat1)
        const dLon = this.deg2rad(lon2 - lon1)
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c
        return distance
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }

    getLocaisByDistance(maxDistance: number): Local[] {
        const userPos = this.getUserPosition()
        return this._locais.filter((local) => {
            if (!local.latitude || !local.longitude) return false
            const distance = this.calculateDistance(userPos.latitude, userPos.longitude, local.latitude, local.longitude)
            return distance <= maxDistance
        })
    }

    getLocaisByComodidades(comodidades: string[]): Local[] {
        if (comodidades.length === 0) return [...this._locais]

        return this._locais.filter((local) => {
            if (!local.comodidades) return false
            return comodidades.every((comodidade) => local.comodidades?.includes(comodidade))
        })
    }

    getComodidades(): string[] {
        const comodidadesSet = new Set<string>()

        this._locais.forEach((local) => {
            if (local.comodidades) {
                local.comodidades.forEach((comodidade) => {
                    comodidadesSet.add(comodidade)
                })
            }
        })

        return Array.from(comodidadesSet)
    }

    getNotificacoes(): Notificacao[] {
        return [...this._notificacoes]
    }

    getNotificacoesByUsuario(usuarioId: number): Notificacao[] {
        return this._notificacoes.filter((notificacao) => notificacao.id_usuario === usuarioId)
    }

    getNotificacoesByEmpresa(empresaId: number): Notificacao[] {
        return this._notificacoes.filter((notificacao) => notificacao.id_empresa === empresaId)
    }

    getNotificacoesNaoLidasCount(usuarioId?: number, empresaId?: number): number {
        if (usuarioId) {
            return this._notificacoes.filter((n) => n.id_usuario === usuarioId && !n.lida).length
        } else if (empresaId) {
            return this._notificacoes.filter((n) => n.id_empresa === empresaId && !n.lida).length
        }
        return 0
    }

    addNotificacao(notificacao: Notificacao): Notificacao {
        const newId = this._notificacoes.length > 0 ? Math.max(...this._notificacoes.map((n) => n.id_notificacao)) + 1 : 1
        notificacao.id_notificacao = newId
        this._notificacoes.push(notificacao)
        this.saveToLocalStorage()
        this.notificacoesChangedSubject.next(true)
        return notificacao
    }

    marcarNotificacaoComoLida(id: number): void {
        const notificacao = this._notificacoes.find((n) => n.id_notificacao === id)
        if (notificacao) {
            notificacao.lida = true
            this.saveToLocalStorage()

            this.notificacoesChangedSubject.next(true)
        }
    }

    marcarTodasNotificacoesComoLidas(usuarioId?: number, empresaId?: number): void {
        let mudanca = false

        if (usuarioId) {
            this._notificacoes
                .filter((n) => n.id_usuario === usuarioId && !n.lida)
                .forEach((n) => {
                    n.lida = true
                    mudanca = true
                })
        } else if (empresaId) {
            this._notificacoes
                .filter((n) => n.id_empresa === empresaId && !n.lida)
                .forEach((n) => {
                    n.lida = true
                    mudanca = true
                })
        }
        if (mudanca) {
            this.saveToLocalStorage()
            this.notificacoesChangedSubject.next(true)
        }
    }

    excluirNotificacao(id: number): void {
        const index = this._notificacoes.findIndex((n) => n.id_notificacao === id)
        if (index !== -1) {
            this._notificacoes.splice(index, 1)
            this.saveToLocalStorage()
            this.notificacoesChangedSubject.next(true)
        }
    }

    excluirTodasNotificacoes(usuarioId?: number, empresaId?: number): void {
        const tamanhoAnterior = this._notificacoes.length
        if (usuarioId) {
            this._notificacoes = this._notificacoes.filter((n) => n.id_usuario !== usuarioId)
        } else if (empresaId) {
            this._notificacoes = this._notificacoes.filter((n) => n.id_empresa !== empresaId)
        }
        if (tamanhoAnterior !== this._notificacoes.length) {
            this.saveToLocalStorage()
            this.notificacoesChangedSubject.next(true)
        }
    }

    deleteLocal(id: number): void {
        const index = this._locais.findIndex(local => local.id_local === id)
        if (index !== -1) {
            this._locais.splice(index, 1)
            this.saveToLocalStorage()
        }

        this._comentarios = this._comentarios.filter(c => c.id_local !== id)

        this._favoritos = this._favoritos.filter(f => f.id_local !== id)

        this._notificacoes = this._notificacoes.filter(n =>
            !(n.tipo === 'avaliacao' && n.link?.includes(`/local/${id}`))
        )
    }

    updateUsuario(usuario: Usuario): void {
        const index = this._usuarios.findIndex((u) => u.id_usuario === usuario.id_usuario)
        if (index !== -1) {
            this._usuarios[index] = usuario
            this.saveToLocalStorage()
        }
    }

    updateEmpresa(empresa: Empresa): void {
        const index = this._empresas.findIndex((e) => e.id_empresa === empresa.id_empresa)
        if (index !== -1) {
            this._empresas[index] = empresa
            this.saveToLocalStorage()
        }
    }

    updateLocal(local: Local): void {
        const index = this._locais.findIndex((l) => l.id_local === local.id_local)
        if (index !== -1) {
            this._locais[index] = local
            this.saveToLocalStorage()
        }
    }

    addReserva(reserva: Reserva): Reserva {
        let reservas: Reserva[] = []
        const storedReservas = localStorage.getItem("reservas")
        if (storedReservas) {
            reservas = JSON.parse(storedReservas)
        }

        const newId = reservas.length > 0 ? Math.max(...reservas.map((r) => r.id_reserva)) + 1 : 1
        reserva.id_reserva = newId

        reservas.push(reserva)


        localStorage.setItem("reservas", JSON.stringify(reservas))

        return reserva
    }

    getReservasByUsuario(usuarioId: number): Reserva[] {
        const storedReservas = localStorage.getItem("reservas")
        if (!storedReservas) return []

        const reservas: Reserva[] = JSON.parse(storedReservas)
        return reservas.filter((r) => r.id_usuario === usuarioId)
    }

    getReservasByLocal(localId: number): Reserva[] {
        const storedReservas = localStorage.getItem("reservas")
        if (!storedReservas) return []

        const reservas: Reserva[] = JSON.parse(storedReservas)
        return reservas.filter((r) => r.id_local === localId)
    }

    getReservaById(id: number): Reserva | undefined {
        const storedReservas = localStorage.getItem("reservas");
        if (!storedReservas) return undefined;

        const reservas: Reserva[] = JSON.parse(storedReservas);

        reservas.forEach(reserva => {
            if (typeof reserva.data_inicio === 'string') {
                reserva.data_inicio = new Date(reserva.data_inicio);
            }
            if (typeof reserva.data_fim === 'string') {
                reserva.data_fim = new Date(reserva.data_fim);
            }
            if (typeof reserva.data_reserva === 'string') {
                reserva.data_reserva = new Date(reserva.data_reserva);
            }
        });

        return reservas.find(r => r.id_reserva === id);
    }

    updateReserva(reserva: Reserva): void {
        const storedReservas = localStorage.getItem("reservas");
        if (!storedReservas) return;

        const reservas: Reserva[] = JSON.parse(storedReservas);
        const index = reservas.findIndex(r => r.id_reserva === reserva.id_reserva);
        if (index !== -1) {
            reservas[index] = reserva;
            localStorage.setItem("reservas", JSON.stringify(reservas));
        }
    }

}
