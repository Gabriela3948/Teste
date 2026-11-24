import type {W} from '../common/Captions';
import narr from './narr.json';
import b2 from './w8055.json';
import {CUT_B2, NARR0, S_B2} from './timing';

// texto do roteiro (Notion), alinhado 1:1 com os tempos da narracao
const SCRIPT = 'Agora você cadastra pontos de interesse direto no mapa: posto, hotel credenciado, cliente, ponto de apoio. Também já dá pra ver a cobertura de antenas 4G no mapa, então quando um veículo perde sinal, você sabe se é a região ou o equipamento. A assinatura digital já tá integrada com a ClickSign, direto na plataforma. A gestão de tickets de suporte também é integrada, direto no seu painel. E você acompanha seus chips em tempo real, com consumo, status e ativação de cada linha. Homologamos dois equipamentos novos: a câmera Jimi 181 e o aparelho BWS NB2.'.split(' ');
const nw = narr as W[];
if (nw.length !== SCRIPT.length) throw new Error('narracao e roteiro com numero de palavras diferente');
const narration: W[] = nw.map((x, i) => ({w: SCRIPT[i], s: (x.w.startsWith('Homologamos') ? 29.58 : x.s) + NARR0 / 30, e: x.e + NARR0 / 30}));
const closing: W[] = (b2 as W[]).map((x) => ({w: x.w.replace(/^aldeia/, 'Aldeia'), s: Math.max(0.04, x.s - CUT_B2) + S_B2 / 30, e: Math.max(0.1, x.e - CUT_B2) + S_B2 / 30}));
closing[0].s = S_B2 / 30 + 0.04;
export const WORDS: W[] = [...narration, ...closing];
