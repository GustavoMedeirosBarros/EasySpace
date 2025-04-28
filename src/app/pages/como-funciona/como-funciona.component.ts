import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Step {
  title: string
  description: string
  icon: string
  image?: string
}

interface FAQ {
  question: string
  answer: string
}

@Component({
  selector: 'app-como-funciona',
  imports: [RouterLink, CommonModule],
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.css'
})
export class ComoFuncionaComponent {
  stepsForRenters: Step[] = [
    {
      title: "Busque o espaço ideal",
      description:
        "Utilize nossos filtros avançados para encontrar o espaço perfeito para sua necessidade. Filtre por localização, tipo de espaço, preço e comodidades.",
      icon: "bi-search",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Entre em contato",
      description:
        "Converse diretamente com o proprietário através do nosso chat integrado. Tire dúvidas e negocie detalhes sobre o espaço.",
      icon: "bi-chat-dots",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Reserve o espaço",
      description:
        "Faça sua reserva de forma rápida e segura. Escolha a data e horário ideais para seu evento ou necessidade.",
      icon: "bi-calendar-check",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Aproveite sua experiência",
      description:
        "Utilize o espaço conforme combinado e aproveite. Após o uso, deixe sua avaliação para ajudar outros usuários.",
      icon: "bi-emoji-smile",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  stepsForOwners: Step[] = [
    {
      title: "Cadastre seu espaço",
      description:
        "Crie um anúncio detalhado do seu espaço, incluindo fotos de qualidade, descrição completa e todas as comodidades oferecidas.",
      icon: "bi-plus-circle",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Gerencie suas reservas",
      description:
        "Receba solicitações de reserva e gerencie sua agenda de forma prática. Aceite ou recuse reservas conforme sua disponibilidade.",
      icon: "bi-calendar-week",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Comunique-se com os clientes",
      description:
        "Utilize nosso sistema de mensagens para conversar com os interessados, esclarecer dúvidas e combinar detalhes.",
      icon: "bi-chat-text",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Receba pagamentos",
      description:
        "Receba os pagamentos de forma segura através da nossa plataforma, com transferência direta para sua conta bancária.",
      icon: "bi-cash-coin",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  faqs: FAQ[] = [
    {
      question: "Como funciona o pagamento?",
      answer:
        "Os pagamentos são processados de forma segura através da nossa plataforma. Aceitamos cartões de crédito, débito e PIX. O valor é transferido para o proprietário após a confirmação da reserva, descontando nossa taxa de serviço.",
    },
    {
      question: "O que acontece se eu precisar cancelar uma reserva?",
      answer:
        "Nossa política de cancelamento varia de acordo com a antecedência. Cancelamentos com mais de 7 dias de antecedência recebem reembolso total. Entre 3 e 7 dias, o reembolso é de 50%. Com menos de 3 dias, não há reembolso. Cada proprietário também pode definir políticas específicas.",
    },
    {
      question: "Como sei que o espaço é confiável?",
      answer:
        "Todos os espaços passam por uma verificação básica e contam com avaliações de usuários anteriores. Recomendamos sempre verificar as avaliações e conversar com o proprietário antes de fazer a reserva.",
    },
    {
      question: "Qual é a taxa cobrada pela plataforma?",
      answer:
        "Cobramos uma taxa de serviço de 10% sobre o valor da reserva para os locatários. Para os proprietários, a taxa é de 3% para cobrir os custos de processamento de pagamento.",
    },
    {
      question: "Como anunciar meu espaço?",
      answer:
        'Para anunciar seu espaço, basta criar uma conta, clicar em "Anunciar espaço" e preencher o formulário com as informações do seu local. Recomendamos incluir fotos de qualidade e uma descrição detalhada.',
    },
    {
      question: "É possível visitar o espaço antes de reservar?",
      answer:
        "Sim, você pode entrar em contato com o proprietário através do nosso chat e combinar uma visita prévia ao local, sujeito à disponibilidade do proprietário.",
    },
  ]
}
