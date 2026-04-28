export const SECTIONS = {
  QUEM_VOCE_E:       'Quem você é',
  O_QUE_FAZ:         'O que você faz',
  SUA_HISTORIA:      'Sua história',
  PERSONALIDADE:     'Personalidade',
  VALORES:           'Valores',
  PROPOSITO:         'Propósito',
  SEU_PUBLICO:       'Seu público',
  SEUS_DIFERENCIAIS: 'Seus diferenciais',
  CONTEUDO:          'Conteúdo',
  VOZ_E_TOM:         'Voz e tom',
  ESTETICA:          'Estética',
  VISAO:             'Visão',
  NOSSA_JORNADA:     'Nossa jornada',
}

export const pages = [
  // ─── BLOCO 1 · QUEM VOCÊ É ────────────────────────────────────────────────

  {
    id: 'basic_info',
    section: SECTIONS.QUEM_VOCE_E,
    questions: [
      {
        id: 'full_name',
        type: 'text',
        question: 'Qual é o seu nome completo e como você gosta de ser chamad@?',
        placeholder: 'Nome completo · apelido',
        required: true,
      },
      {
        id: 'location',
        type: 'text',
        question: 'Onde você mora? E onde você nasceu?',
        placeholder: 'Ex: moro em SP, nasci em BH',
        required: false,
      },
      {
        id: 'age',
        type: 'text',
        question: 'Qual é a sua idade?',
        placeholder: '...',
        required: false,
      },
    ],
  },

  // ─── BLOCO 2 · O QUE VOCÊ FAZ ─────────────────────────────────────────────

  {
    id: 'what_you_do',
    section: SECTIONS.O_QUE_FAZ,
    questions: [
      {
        id: 'one_sentence_work',
        type: 'text',
        question: 'Em uma frase: o que você faz?',
        subtitle: 'Não o que você é — o que você faz.',
        placeholder: 'Eu ajudo / crio / transformo...',
        required: true,
      },
      {
        id: 'time_in_market',
        type: 'single_select',
        question: 'Há quanto tempo você está nesse mercado?',
        options: [
          'Estou começando agora',
          '1 a 2 anos',
          '3 a 5 anos',
          '5 a 10 anos',
          'Mais de 10 anos',
        ],
        required: false,
      },
    ],
  },

  // ─── BLOCO 3 · SUA HISTÓRIA ───────────────────────────────────────────────

  {
    id: 'trajectory',
    section: SECTIONS.SUA_HISTORIA,
    questions: [
      {
        id: 'trajectory_text',
        type: 'textarea',
        question: 'Como você chegou até aqui?',
        subtitle: 'Me conta um pouco da sua trajetória — pode ser cronológico, emocional, do jeito que sair.',
        placeholder: 'Pode escrever à vontade...',
        required: false,
      },
    ],
  },

  // ─── BLOCO 4 · PERSONALIDADE ──────────────────────────────────────────────

  {
    id: 'character',
    section: SECTIONS.PERSONALIDADE,
    questions: [
      {
        id: 'movie_character',
        type: 'textarea',
        question: 'Se você fosse um personagem de série ou filme, quem seria — e por quê?',
        subtitle: 'Não precisa ser um favorito. Pode ser uma característica, um jeito de ser.',
        placeholder: 'Personagem · o que te conecta a ele/ela...',
        required: false,
      },
    ],
  },

  {
    id: 'personality_words',
    section: SECTIONS.PERSONALIDADE,
    questions: [
      {
        id: 'words_others_use',
        type: 'multi_select',
        question: 'Escolha até 3 palavras que as pessoas mais próximas usariam para te descrever.',
        maxSelections: 3,
        options: [
          'Intensa', 'Calma', 'Criativa', 'Analítica', 'Divertida', 'Séria',
          'Empática', 'Direta', 'Sonhadora', 'Prática', 'Apaixonada', 'Resiliente',
          'Carismática', 'Reservada', 'Ousada', 'Delicada', 'Estratégica',
          'Espontânea', 'Inspiradora', 'Autêntica',
        ],
        allowCustom: true,
        customPlaceholder: 'Outra palavra...',
        required: false,
      },
      {
        id: 'words_you_use',
        type: 'multi_select',
        question: 'E até 3 que você usaria para se descrever?',
        subtitle: 'Pode coincidir com as anteriores ou não.',
        maxSelections: 3,
        options: [
          'Intensa', 'Calma', 'Criativa', 'Analítica', 'Divertida', 'Séria',
          'Empática', 'Direta', 'Sonhadora', 'Prática', 'Apaixonada', 'Resiliente',
          'Carismática', 'Reservada', 'Ousada', 'Delicada', 'Estratégica',
          'Espontânea', 'Inspiradora', 'Autêntica',
        ],
        allowCustom: true,
        customPlaceholder: 'Outra palavra...',
        required: false,
      },
    ],
  },

  {
    id: 'energy',
    section: SECTIONS.PERSONALIDADE,
    questions: [
      {
        id: 'what_energizes',
        type: 'multi_select',
        question: 'O que te energiza?',
        subtitle: 'Selecione quantos quiser.',
        options: [
          'Conectar com pessoas', 'Criar algo novo', 'Resolver problemas',
          'Liderar e inspirar', 'Aprender e pesquisar', 'Entreter e divertir',
          'Ensinar e compartilhar', 'Construir sistemas', 'Provocar transformação',
          'Colaborar em equipe',
        ],
        required: false,
      },
      {
        id: 'what_drains',
        type: 'textarea',
        question: 'O que te drena sem você perceber?',
        placeholder: 'Pode ser uma situação, um tipo de tarefa, um ambiente...',
        required: false,
      },
    ],
  },

  // ─── BLOCO 5 · VALORES ────────────────────────────────────────────────────

  {
    id: 'defend',
    section: SECTIONS.VALORES,
    questions: [
      {
        id: 'what_you_defend',
        type: 'textarea',
        question: 'O que você defende, mesmo quando é impopular?',
        placeholder: 'Sem filtro aqui...',
        required: false,
      },
    ],
  },

  {
    id: 'values',
    section: SECTIONS.VALORES,
    questions: [
      {
        id: 'would_never_do',
        type: 'textarea',
        question: 'O que você nunca faria, por mais que pagassem?',
        placeholder: 'Uma linha vermelha que não negocia...',
        required: false,
      },
      {
        id: 'main_value',
        type: 'single_select',
        question: 'Qual é o seu maior valor?',
        options: [
          'Liberdade', 'Família', 'Impacto', 'Autenticidade',
          'Excelência', 'Conexão', 'Aventura', 'Segurança',
          'Conhecimento', 'Criatividade', 'Justiça', 'Prazer',
        ],
        required: false,
      },
    ],
  },

  // ─── BLOCO 6 · PROPÓSITO ──────────────────────────────────────────────────

  {
    id: 'why',
    section: SECTIONS.PROPOSITO,
    questions: [
      {
        id: 'why_you_do_it',
        type: 'textarea',
        question: 'Por que você faz o que faz?',
        subtitle: 'Não a resposta bonita. A real.',
        placeholder: 'Pode começar com "porque eu..."',
        required: false,
      },
    ],
  },

  {
    id: 'legacy',
    section: SECTIONS.PROPOSITO,
    questions: [
      {
        id: 'leave_for_world',
        type: 'textarea',
        question: 'O que você quer deixar pro mundo?',
        placeholder: 'Pode ser grande, pode ser íntimo...',
        required: false,
      },
      {
        id: 'transformation',
        type: 'textarea',
        question: 'Que transformação você provoca na vida das pessoas?',
        placeholder: 'Antes e depois de te conhecerem...',
        required: false,
      },
    ],
  },

  {
    id: 'brand_impact',
    section: SECTIONS.PROPOSITO,
    questions: [
      {
        id: 'brand_disappears',
        type: 'textarea',
        question: 'Se a sua marca sumisse amanhã, o que o mundo perderia?',
        placeholder: 'Pensa em quem seria mais impactad@...',
        required: false,
      },
    ],
  },

  // ─── BLOCO 7 · SEU PÚBLICO ────────────────────────────────────────────────

  {
    id: 'ideal_client',
    section: SECTIONS.SEU_PUBLICO,
    questions: [
      {
        id: 'dream_client',
        type: 'textarea',
        question: 'Quem é a pessoa que você mais quer impactar?',
        subtitle: 'Descreve ela — idade, momento de vida, dores, sonhos.',
        placeholder: 'Pinta um retrato...',
        required: false,
      },
      {
        id: 'client_tries_alone',
        type: 'textarea',
        question: 'O que ela tenta fazer sozinha antes de te encontrar?',
        placeholder: 'O que ela já testou, pesquisou, tentou resolver...',
        required: false,
      },
    ],
  },

  {
    id: 'client_journey',
    section: SECTIONS.SEU_PUBLICO,
    questions: [
      {
        id: 'client_feeling_before',
        type: 'text',
        question: 'Como ela se sente quando chega até você?',
        placeholder: 'Em uma ou duas palavras...',
        required: false,
      },
      {
        id: 'client_tells_friend',
        type: 'textarea',
        question: 'E depois de trabalhar com você, o que ela fala para uma amiga?',
        placeholder: '"Você precisa conhecer a [seu nome], porque..."',
        required: false,
      },
    ],
  },

  // ─── BLOCO 8 · SEUS DIFERENCIAIS ─────────────────────────────────────────

  {
    id: 'unique',
    section: SECTIONS.SEUS_DIFERENCIAIS,
    questions: [
      {
        id: 'what_makes_unique',
        type: 'textarea',
        question: 'O que você faz que ninguém mais faz do jeito que você faz?',
        subtitle: 'Não features. O real.',
        placeholder: 'Pode ser um método, uma energia, uma perspectiva...',
        required: false,
      },
    ],
  },

  {
    id: 'superpower',
    section: SECTIONS.SEUS_DIFERENCIAIS,
    questions: [
      {
        id: 'superpower_text',
        type: 'textarea',
        question: 'Qual é o seu superpoder?',
        subtitle: 'O que vem fácil para você e parece difícil para os outros.',
        placeholder: 'Sem falsa modéstia aqui...',
        required: false,
      },
      {
        id: 'never_confused_with',
        type: 'textarea',
        question: 'Com o que você nunca quer ser confundid@?',
        placeholder: 'Uma comparação, um estereótipo, um rótulo...',
        required: false,
      },
    ],
  },

  {
    id: 'enemy',
    section: SECTIONS.SEUS_DIFERENCIAIS,
    questions: [
      {
        id: 'brand_enemy',
        type: 'textarea',
        question: 'Se a sua marca tivesse um "inimigo" — algo que ela combate —, o que seria?',
        subtitle: 'Pode ser um comportamento, uma crença, um sistema.',
        placeholder: 'Minha marca combate...',
        required: false,
      },
    ],
  },

  // ─── BLOCO 9 · CONTEÚDO ───────────────────────────────────────────────────

  {
    id: 'content_habits',
    section: SECTIONS.CONTEUDO,
    questions: [
      {
        id: 'content_consume',
        type: 'multi_select',
        question: 'Que tipo de conteúdo você consome sem se cansar?',
        options: [
          'Documentários', 'Podcasts longos', 'Vídeos curtos', 'Livros',
          'Newsletters', 'Threads e tópicos', 'Entrevistas', 'Conteúdo técnico',
          'Storytelling pessoal', 'Humor e entretenimento', 'Polêmicas e debates',
          'Arte e estética',
        ],
        required: false,
      },
      {
        id: 'content_love_creating',
        type: 'multi_select',
        question: 'E que tipo de conteúdo você ama criar?',
        options: [
          'Texto longo e profundo', 'Vídeos', 'Reels / TikToks', 'Carrosseis',
          'Stories', 'Podcasts / Áudios', 'Fotos autorais', 'Lives',
          'Newsletters', 'Threads', 'Conteúdo educativo', 'Bastidores',
        ],
        required: false,
      },
    ],
  },

  {
    id: 'content_pain',
    section: SECTIONS.CONTEUDO,
    questions: [
      {
        id: 'content_hate',
        type: 'multi_select',
        question: 'Que tipo de conteúdo você sente que "deveria" criar, mas odeia?',
        options: [
          'Vídeos longos', 'Reels / TikToks', 'Carrosseis', 'Stories diários',
          'Conteúdo educativo', 'Vendas diretas', 'Bastidores pessoais',
          'Tendências e virais', 'Nenhum — curto tudo', 'Ainda estou descobrindo',
        ],
        required: false,
      },
      {
        id: 'talk_for_hours',
        type: 'textarea',
        question: 'Qual assunto você consegue falar por horas sem roteiro?',
        placeholder: 'O que te faz perder a noção do tempo...',
        required: false,
      },
    ],
  },

  {
    id: 'content_prefs',
    section: SECTIONS.CONTEUDO,
    questions: [
      {
        id: 'content_goal',
        type: 'multi_select',
        question: 'Você prefere criar conteúdo que...',
        subtitle: 'Pode selecionar mais de um.',
        options: [
          'Educa e ensina', 'Inspira e motiva', 'Entretém e diverte',
          'Provoca e questiona', 'Documenta e registra', 'Conecta e aproxima',
          'Vende de forma natural',
        ],
        required: false,
      },
      {
        id: 'favorite_format',
        type: 'multi_select',
        question: 'Qual formato você mais gosta de criar?',
        subtitle: 'Pode marcar quantos quiser.',
        options: [
          'Vídeo longo (YouTube)', 'Reels / TikTok', 'Carrossel', 'Foto',
          'Stories', 'Texto longo (LinkedIn / blog)', 'Newsletter',
          'Podcast / Áudio', 'Live',
        ],
        required: false,
      },
    ],
  },

  // ─── BLOCO 10 · VOZ E TOM ─────────────────────────────────────────────────

  {
    id: 'comm_style',
    section: SECTIONS.VOZ_E_TOM,
    questions: [
      {
        id: 'how_you_communicate',
        type: 'multi_select',
        question: 'Como você se comunica com a sua audiência?',
        subtitle: 'Selecione os que mais combinam com você.',
        options: [
          'Próximo e informal — como papo de amigo',
          'Especialista e autoridade — transmito segurança',
          'Provocador — questiono o que está estabelecido',
          'Leve e bem-humorado — sempre com um toque de humor',
          'Poético e reflexivo — minhas palavras têm peso',
          'Direto e objetivo — sem rodeios',
          'Motivacional — elevo a energia de quem me acompanha',
        ],
        required: false,
      },
    ],
  },

  {
    id: 'voice',
    section: SECTIONS.VOZ_E_TOM,
    questions: [
      {
        id: 'words_to_avoid',
        type: 'textarea',
        question: 'Que palavras você nunca quer que usem para descrever a sua marca?',
        placeholder: 'Palavras, adjetivos, comparações que te fazem torcer o nariz...',
        required: false,
      },
      {
        id: 'formality_level',
        type: 'slider',
        question: 'Numa escala, onde você se posiciona?',
        leftLabel: 'Muito formal',
        rightLabel: 'Muito informal',
        min: 1,
        max: 5,
        defaultValue: 3,
        labels: ['Muito formal', 'Formal', 'Equilibrado', 'Informal', 'Muito informal'],
        required: false,
      },
    ],
  },

  // ─── BLOCO 11 · ESTÉTICA ──────────────────────────────────────────────────

  {
    id: 'brand_refs',
    section: SECTIONS.ESTETICA,
    questions: [
      {
        id: 'brand_admire',
        type: 'textarea',
        question: 'Cite uma marca — qualquer segmento — cuja identidade você admira, e me conta por quê.',
        placeholder: 'Marca · o que te atrai nela...',
        required: false,
      },
      {
        id: 'brand_avoid',
        type: 'text',
        question: 'E uma marca que você definitivamente não quer parecer?',
        placeholder: 'Nome da marca...',
        required: false,
      },
    ],
  },

  {
    id: 'aesthetics',
    section: SECTIONS.ESTETICA,
    questions: [
      {
        id: 'color_palette',
        type: 'swatch',
        question: 'Que paleta de cores te representa?',
        subtitle: 'Selecione quantas quiser.',
        options: [
          { id: 'warm_neutral',    label: 'Quente e neutro',      colors: ['#D2CBC0', '#F7F4F2', '#7A7871'] },
          { id: 'dark_editorial',  label: 'Dark editorial',        colors: ['#1D1D1B', '#3D3B38', '#7A7871'] },
          { id: 'colorful',        label: 'Colorido e vibrante',   colors: ['#FF6B6B', '#FFD93D', '#6BCB77'] },
          { id: 'pastel',          label: 'Pastel suave',          colors: ['#FFD6E0', '#C9F0FF', '#FFECD2'] },
          { id: 'earthy',          label: 'Terroso e orgânico',    colors: ['#8B6914', '#C4A35A', '#F2E8D5'] },
          { id: 'cool_minimal',    label: 'Frio e minimal',        colors: ['#E8EAF0', '#9BA4B5', '#394867'] },
          { id: 'luxe_gold',       label: 'Luxuoso e dourado',     colors: ['#1A1A1A', '#C9A84C', '#F5F0E8'] },
          { id: 'bold_graphic',    label: 'Bold gráfico',          colors: ['#000000', '#FF0000', '#FFFFFF'] },
        ],
        required: false,
      },
      {
        id: 'aesthetic_style',
        type: 'multi_select',
        question: 'Que estética te representa?',
        options: [
          'Minimalista', 'Editorial', 'Colorido e vibrante', 'Quente e aconchegante',
          'Clean e tecnológico', 'Vintage / retrô', 'Natural e orgânico',
          'Luxuoso e sofisticado', 'Rebelde e ousado', 'Despretensioso e humano',
        ],
        required: false,
      },
    ],
  },

  // ─── BLOCO 12 · VISÃO ─────────────────────────────────────────────────────

  {
    id: 'future',
    section: SECTIONS.VISAO,
    questions: [
      {
        id: 'described_in_3_years',
        type: 'textarea',
        question: 'Em 3 anos, como você quer que as pessoas descrevam a sua marca?',
        subtitle: 'O que você quer que elas sintam, digam, lembrem.',
        placeholder: '"Quando penso na [seu nome], eu lembro de..."',
        required: false,
      },
    ],
  },

  {
    id: 'dreams',
    section: SECTIONS.VISAO,
    questions: [
      {
        id: 'dream_project',
        type: 'textarea',
        question: 'Qual seria o projeto dos seus sonhos que você ainda não realizou?',
        placeholder: 'Pode ser grande. Pode ser íntimo. Pode ser "impossível" (por enquanto).',
        required: false,
      },
      {
        id: 'dream_collaboration',
        type: 'textarea',
        question: 'Que tipo de parceria ou colaboração você sonha em ter?',
        placeholder: 'Com quem? Que tipo de projeto?',
        required: false,
      },
    ],
  },

  {
    id: 'biz_size',
    section: SECTIONS.VISAO,
    questions: [
      {
        id: 'business_size',
        type: 'single_select',
        question: 'Que tamanho de negócio você quer construir?',
        options: [
          'Solo íntimo — trabalho 1:1, não quero escalar',
          'Pequena equipe — até 5 pessoas, crescimento saudável',
          'Empresa estruturada — time, processos, delegação',
          'Presença massiva — escala, alcance, influência ampla',
          'Ainda estou descobrindo isso',
        ],
        required: false,
      },
    ],
  },

  // ─── BLOCO 13 · NOSSA JORNADA ─────────────────────────────────────────────

  {
    id: 'mentorship_why',
    section: SECTIONS.NOSSA_JORNADA,
    questions: [
      {
        id: 'why_said_yes',
        type: 'textarea',
        question: 'O que te fez dizer "sim" para essa mentoria?',
        subtitle: 'Não o porquê racional — o que realmente te moveu.',
        placeholder: 'Foi uma sensação, uma frase, um momento...',
        required: false,
      },
    ],
  },

  {
    id: 'fears',
    section: SECTIONS.NOSSA_JORNADA,
    questions: [
      {
        id: 'biggest_fear',
        type: 'textarea',
        question: 'Qual é o seu maior medo em relação ao seu posicionamento hoje?',
        placeholder: 'Sem julgamento aqui...',
        required: false,
      },
      {
        id: 'what_didnt_work',
        type: 'textarea',
        question: 'O que você já tentou que não funcionou?',
        placeholder: 'Estratégia, formato, abordagem...',
        required: false,
      },
    ],
  },

  {
    id: 'victory',
    section: SECTIONS.NOSSA_JORNADA,
    questions: [
      {
        id: 'victory_definition',
        type: 'textarea',
        question: 'O que seria uma grande vitória para você ao final da nossa jornada?',
        placeholder: 'Em termos concretos e emocionais...',
        required: false,
      },
      {
        id: 'anything_to_know',
        type: 'textarea',
        question: 'Tem alguma coisa que você quer que eu saiba sobre você — que nenhum formulário jamais perguntou?',
        placeholder: 'Espaço livre. Tudo o que vier.',
        required: false,
      },
    ],
  },

  {
    id: 'closing',
    section: SECTIONS.NOSSA_JORNADA,
    questions: [
      {
        id: 'brand_smell',
        type: 'text',
        question: 'Se a sua marca fosse um cheiro, qual seria?',
        subtitle: 'Vale perfume, ingrediente, lugar, sensação.',
        placeholder: 'Ex: café pela manhã, terra molhada, madeira...',
        required: false,
      },
      {
        id: 'defining_song',
        type: 'text',
        question: 'Uma música que te define agora.',
        subtitle: 'Vai ficar entre a gente.',
        placeholder: 'Artista · música...',
        required: false,
      },
    ],
  },
]
