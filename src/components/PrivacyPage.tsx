import React from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle2, FileText, Server, Cookie, HelpCircle, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "25 de Julho de 2026";

  const tableOfContents = [
    { id: 'priv-1', title: '1. Compromisso com a Privacidade e LGPD' },
    { id: 'priv-2', title: '2. Ausência de Armazenamento de Dados de Ponto em Servidores' },
    { id: 'priv-3', title: '3. Dados Coletados Automaticamente e Registro de Logs' },
    { id: 'priv-4', title: '4. Uso de Cookies e Redes de Anúncios (Google AdSense)' },
    { id: 'priv-5', title: '5. Seus Direitos como Titular de Dados (Art. 18 LGPD)' },
    { id: 'priv-6', title: '6. Criptografia e Segurança da Informação' },
    { id: 'priv-7', title: '7. Alterações nesta Política de Privacidade' },
    { id: 'priv-8', title: '8. Encarregado de Proteção de Dados (DPO) e Contato' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conformidade com a LGPD (Lei nº 13.709/2018)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Plataforma <strong>calculadoradehorastrabalhadas.org</strong> — Última atualização: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Table of Contents */}
        <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            Índice da Política de Privacidade
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

        {/* Highlight Callout Box */}
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-5 rounded-r-2xl space-y-2 text-emerald-950 text-xs">
          <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-900">
            <Server className="w-4 h-4 text-emerald-600" /> RESUMO EXECUTIVO DE PRIVACIDADE:
          </h4>
          <p className="leading-relaxed">
            No <strong>calculadoradehorastrabalhadas.org</strong>, sua privacidade é prioridade absoluta. <strong>NÃO coletamos, NÃO salvamos e NÃO enviamos seus horários de entrada, saída, salários ou cartões de ponto para nenhum servidor externo</strong>. Todos os cálculos matemáticos ocorrem exclusivamente na memória temporária do seu próprio navegador de internet.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-neutral-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section id="priv-1" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              1. Compromisso com a Privacidade e LGPD
            </h2>
            <p>
              Esta Política de Privacidade descreve como o portal <strong>calculadoradehorastrabalhadas.org</strong> trata as informações de seus visitantes em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei Federal nº 13.709/2018) e com as diretrizes internacionais do Regulamento Geral sobre a Proteção de Dados (GDPR).
            </p>
          </section>

          {/* Section 2 */}
          <section id="priv-2" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              2. Ausência de Armazenamento de Dados de Ponto em Servidores
            </h2>
            <p>
              Queremos garantir total tranquilidade no uso das nossas calculadoras. Quando você digita seus horários de entrada, intervalo de almoço e saída, esses dados são processados localmente utilizando a linguagem JavaScript no seu próprio dispositivo.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
              <li>Não há banco de dados relacional armazenando seus registros de ponto.</li>
              <li>Não armazenamos nomes de empresas, salários informados ou identificadores de funcionários.</li>
              <li>Ao fechar ou recarregar a aba do navegador, os dados informados são limpos automaticamente, exceto se você optar por salvar preferências locais (localStorage).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="priv-3" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              3. Dados Coletados Automaticamente e Registro de Logs
            </h2>
            <p>
              Como padrão de infraestrutura de servidores web na internet, quando você acessa o site, dados técnicos não identificáveis são registrados em logs do servidor exclusivamente para fins estatísticos e de segurança cibernética:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
              <li>Endereço IP (Anonymized / Pseudonimizado).</li>
              <li>Tipo de navegador (Browser) e sistema operacional.</li>
              <li>Data, hora e página acessada.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="priv-4" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-blue-600" />
              4. Uso de Cookies e Redes de Anúncios (Google AdSense)
            </h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento adequado da aplicação. Além disso, exibimos anúncios publicitários gerenciados pelo <strong>Google AdSense</strong> para financiar a gratuidade do portal.
            </p>
            <div className="bg-neutral-50 p-4.5 rounded-2xl border border-neutral-200 text-xs space-y-3">
              <p className="font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Declaração Oficial de Cookies do Google AdSense e Terceiros:
              </p>
              <p className="text-neutral-700 italic bg-white p-3 rounded-xl border border-neutral-200 leading-relaxed font-serif">
                "Terceiros, incluindo o Google, usam cookies para veicular anúncios com base em visitas anteriores do usuário a este e a outros sites. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios aos usuários com base na visita a seus sites e/ou a outros sites na Internet. Os usuários podem optar por sair da publicidade personalizada acessando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-sans font-bold">Configurações de Anúncios do Google</a>."
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>Alternativamente, você pode optar por desativar o uso de cookies de terceiros para publicidade personalizada acessando o site <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">www.aboutads.info</a>.</li>
                <li>Cookies de medição estatística (como Google Analytics) são utilizados para analisar o tráfego anonimizado e aprimorar as calculadoras.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="priv-5" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              5. Seus Direitos como Titular de Dados (Art. 18 LGPD)
            </h2>
            <p>
              Como titular dos seus dados pessoais, a LGPD garante a você os seguintes direitos perante qualquer controlador de dados:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <strong>• Confirmação e Acesso:</strong> Direito de saber se tratamos dados seus.
              </div>
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <strong>• Correção:</strong> Solicitar a atualização de dados incompletos ou inexatos.
              </div>
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <strong>• Eliminação:</strong> Solicitar a exclusão de dados pessoais eventualmente fornecidos via formulário.
              </div>
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <strong>• Revogação de Consentimento:</strong> Desativar cookies em seu navegador a qualquer momento.
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="priv-6" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              6. Criptografia e Segurança da Informação
            </h2>
            <p>
              Todas as comunicações entre o seu navegador de internet e o portal <strong>calculadoradehorastrabalhadas.org</strong> são protegidas por criptografia HTTPS com certificado de segurança SSL de 256 bits, garantindo que ninguém possa interceptar sua conexão.
            </p>
          </section>

          {/* Section 7 & 8 */}
          <section id="priv-7" className="space-y-3 border-b border-neutral-100 pb-6">
            <h2 className="text-lg font-bold text-neutral-900">
              7. Alterações nesta Política de Privacidade
            </h2>
            <p>
              Esta política pode ser revisada periodicamente para refletir melhorias em nossas práticas de segurança ou adequações legislativas. Recomendamos a consulta regular desta página.
            </p>
          </section>

          <section id="priv-8" className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              8. Encarregado de Proteção de Dados (DPO) e Contato
            </h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus direitos previstos na LGPD, entre em contato com nosso encarregado de privacidade através do e-mail:
            </p>
            <p className="font-mono text-xs bg-blue-50 text-blue-900 p-3 rounded-xl font-bold inline-block border border-blue-200">
              contato@calculadoradehorastrabalhadas.org
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
