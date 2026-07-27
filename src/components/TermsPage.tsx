import React from 'react';
import { FileText, ShieldAlert, Scale, CheckCircle2, Lock, ExternalLink, Calendar, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "25 de Julho de 2026";

  const tableOfContents = [
    { id: 'term-1', title: '1. Aceitação dos Termos de Uso' },
    { id: 'term-2', title: '2. Descrição e Natureza Informativa dos Serviços' },
    { id: 'term-3', title: '3. Isenção de Responsabilidade e Exatidão dos Cálculos' },
    { id: 'term-4', title: '4. Propriedade Intelectual e Direitos Autorais' },
    { id: 'term-5', title: '5. Regras de Uso Aceitável e Proibições' },
    { id: 'term-6', title: '6. Links para Terceiros e Anúncios Publicitários' },
    { id: 'term-7', title: '7. Modificações dos Termos e Atualizações' },
    { id: 'term-8', title: '8. Legislação Aplicável e Foro' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Documento Jurídico Oficial</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Termos de Uso e Condições de Serviço
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Plataforma <strong>calculadoradehorastrabalhadas.org</strong> — Última atualização: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Table of Contents Box */}
        <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600" />
            Índice de Seções dos Termos de Uso
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700 font-medium pt-1">
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Sections */}
        <div className="space-y-8 text-neutral-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section id="term-1" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              1. Aceitação dos Termos de Uso
            </h2>
            <p>
              Ao acessar, navegar ou utilizar o portal <strong>calculadoradehorastrabalhadas.org</strong> ("Website"), o usuário declara ter lido, compreendido e concordado de forma irrestrita com todos os termos, condições e avisos legais aqui estabelecidos. Caso não concorde com qualquer disposição destes termos, o usuário deve descontinuar o acesso e uso das nossas ferramentas imediatamente.
            </p>
          </section>

          {/* Section 2 */}
          <section id="term-2" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              2. Descrição e Natureza Informativa dos Serviços
            </h2>
            <p>
              O <strong>calculadoradehorastrabalhadas.org</strong> disponibiliza gratuitamente ferramentas e simuladores matemáticos online voltados para a apuração automatizada de jornadas de trabalho, intervalos de descanso, divisores salariais, horas extras e adicionais noturnos fundamentados na Consolidação das Leis do Trabalho (CLT).
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-900 space-y-1">
              <strong className="font-bold block flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> AVISO IMPORTANTE SOBRE CONSULTORIA JURÍDICA / CONTÁBIL:
              </strong>
              <p>
                Os resultados gerados pelas nossas calculadoras possuem caráter estritamente educativo, de simulação e orientação informativa. Nossas ferramentas <strong>não substituem pareceres jurídicos formais, laudos periciais trabalhistas ou a validação por um profissional habilitado de Contabilidade ou Recursos Humanos</strong>.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="term-3" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              3. Isenção de Responsabilidade e Exatidão dos Cálculos
            </h2>
            <p>
              Embora empreguemos os melhores esforços e rigor técnico para manter todas as fórmulas matemáticas perfeitamente alinhadas com a CLT e as Súmulas do Tribunal Superior do Trabalho (TST):
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Não nos responsabilizamos por divergências decorrentes de Convenções Coletivas de Trabalho (CCT) ou Acordos Coletivos específicos de categorias profissionais que fixem regras diferenciadas das normas gerais da CLT.</li>
              <li>Não nos responsabilizamos por decisões financeiras, trabalhistas ou judiciais tomadas com base unicamente nos resultados exibidos em nossas simuladoras.</li>
              <li>O usuário é inteiramente responsável por conferir a exatidão dos dados inseridos nos campos de entrada da calculadora.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="term-4" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              4. Propriedade Intelectual e Direitos Autorais
            </h2>
            <p>
              Todo o conteúdo presente no <strong>calculadoradehorastrabalhadas.org</strong> — incluindo códigos de programação, algoritmos de cálculo, textos explicativos, layout visual, logotipos, tabelas e arquivos de planilhas para download — é protegido pelas leis de propriedade intelectual do Brasil (Lei de Direitos Autorais nº 9.610/1998).
            </p>
            <p className="text-xs">
              É proibida a reprodução, cópia, espelhamento, venda ou redistribuição não autorizada dos nossos sistemas sem o prévio consentimento por escrito dos administradores do portal.
            </p>
          </section>

          {/* Section 5 */}
          <section id="term-5" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              5. Regras de Uso Aceitável e Proibições
            </h2>
            <p>
              Ao utilizar este site, o usuário se compromete a:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Não utilizar robôs, crawlers ou scripts automatizados de extração maciça de dados (scraping) que sobrecarreguem nossa infraestrutura.</li>
              <li>Não tentar violar as medidas de segurança ou tentar injetar códigos maliciosos no Website.</li>
              <li>Utilizar os recursos de forma ética e exclusivamente legal.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="term-6" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              6. Links para Terceiros e Anúncios Publicitários
            </h2>
            <p>
              Para manter o serviço 100% gratuito para os usuários, o <strong>calculadoradehorastrabalhadas.org</strong> pode exibir anúncios publicitários fornecidos por redes parceiras, como o Google AdSense. Além disso, nosso site pode conter links para sites de órgãos governamentais (como o Planalto ou TST). Não exercemos controle sobre o conteúdo ou práticas de privacidade desses sites terceiros.
            </p>
          </section>

          {/* Section 7 */}
          <section id="term-7" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              7. Modificações dos Termos e Atualizações
            </h2>
            <p>
              Reservamo-nos o direito de alterar ou atualizar estes Termos de Uso a qualquer momento, sem aviso prévio individual. Quaisquer alterações entram em vigor imediatamente após sua publicação nesta página. A continuação do uso do site após a publicação de alterações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Section 8 */}
          <section id="term-8" className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">
              8. Legislação Aplicável e Foro
            </h2>
            <p>
              Estes Termos de Uso são regidos e interpretados em conformidade com as leis da República Federativa do Brasil. Para a solução de quaisquer controvérsias oriundas deste documento, fica eleito o Foro da Comarca competente sob a legislação brasileira.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
