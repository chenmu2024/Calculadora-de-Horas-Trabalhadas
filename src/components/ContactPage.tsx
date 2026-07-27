import React, { useState } from 'react';
import { 
  Mail, MessageSquare, Send, CheckCircle2, Clock, 
  HelpCircle, AlertCircle, Sparkles, MapPin, Building2, ShieldCheck
} from 'lucide-react';

interface ContactPageProps {
  onSelectCalculator?: (tab: string) => void;
}

export default function ContactPage({ onSelectCalculator }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'duvida',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>Fale Conosco</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Entre em Contato Conosco
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Tem alguma dúvida sobre os cálculos, sugestão de melhoria, report de erro ou proposta comercial? Nossa equipe está pronta para responder seu contato.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Envie sua Mensagem
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Preencha o formulário abaixo. Responderemos diretamente em seu e-mail cadastrado.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-emerald-950 text-base">Mensagem Enviada com Sucesso!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Agradecemos seu contato. Sua mensagem foi recebida pela equipe do <strong>calculadoradehorastrabalhadas.org</strong> e responderemos no prazo máximo de 24 a 48 horas úteis.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'duvida', message: '' });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer mt-2"
              >
                Enviar Outra Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Seu Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Seu E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: maria@exemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Assunto Principal <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white transition-all cursor-pointer"
                >
                  <option value="duvida">Dúvida sobre Cálculos ou CLT</option>
                  <option value="sugestao">Sugestão de Nova Funcionalidade</option>
                  <option value="erro">Reportar Erro / Inconsistência</option>
                  <option value="excel">Dúvida sobre a Planilha Excel</option>
                  <option value="comercial">Contato Comercial ou Parceria</option>
                  <option value="outros">Outros Assuntos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Sua Mensagem <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descreva detalhadamente sua dúvida, cálculo ou sugestão..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-y"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Channels Card */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Canais Oficiais de Atendimento
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 block">E-mail Direto:</span>
                  <a href="mailto:contato@calculadoradehorastrabalhadas.org" className="text-blue-600 font-medium hover:underline">
                    contato@calculadoradehorastrabalhadas.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 block">Atendimento & Prazo de Resposta (SLA):</span>
                  <span className="text-neutral-600">Atendimento em até 24 a 48 horas úteis (Segunda a Sexta, das 08h às 18h - Horário de Brasília)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 block">Abrangência e Localização:</span>
                  <span className="text-neutral-600">Atendimento a trabalhadores e empresas de todo o Brasil • São Paulo - SP, Brasil</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 block">Compromisso com o Usuário:</span>
                  <span className="text-neutral-600">Garantimos resposta individualizada e sigilosa para relatórios de bugs e dúvidas de cálculo conforme a LGPD.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Box */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-6 space-y-3">
            <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" /> Dúvida Rápida sobre Cálculo?
            </h4>
            <p className="text-xs text-blue-900 leading-relaxed">
              Muitas dúvidas comuns sobre intervalo intrajornada, tolerância de ponto e hora ficta noturna já estão respondidas no nosso guia completo.
            </p>
            {onSelectCalculator && (
              <button
                onClick={() => onSelectCalculator('blog')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
              >
                Acessar Guia de Dúvidas da CLT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
