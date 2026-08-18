import { Calculator, Shield, FileSpreadsheet, Heart } from 'lucide-react';
import { getHrefForTab } from '../utils/routes';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Domain Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Calculator className="w-5 h-5 text-blue-500" />
            <span>calculadoradehorastrabalhadas.org</span>
          </div>
          <p className="text-neutral-400 leading-relaxed text-xs">
            A principal ferramenta online gratuita de cálculo de horas trabalhadas, folha de ponto, horas extras e adicional noturno no Brasil.
          </p>
        </div>

        {/* Col 2: Sub-Calculators */}
        <div>
          <h4 className="text-white font-bold mb-3 text-sm">Calculadoras</h4>
          <ul className="space-y-2">
            <li>
              <a href={getHrefForTab('daily')} onClick={(e) => { e.preventDefault(); handleNav('daily'); }} className="hover:text-white transition-colors" title="Calculadora de Horas Trabalhadas Diária">
                Calculadora Diária (Intervalo)
              </a>
            </li>
            <li>
              <a href={getHrefForTab('timesheet')} onClick={(e) => { e.preventDefault(); handleNav('timesheet'); }} className="hover:text-white transition-colors" title="Calculadora de Horas Semanal 44h CLT">
                Calculadora Semanal (44h CLT)
              </a>
            </li>
            <li>
              <a href={getHrefForTab('monthly')} onClick={(e) => { e.preventDefault(); handleNav('monthly'); }} className="hover:text-white transition-colors" title="Calculadora Mensal de Horas Trabalhadas">
                Calculadora Mensal
              </a>
            </li>
            <li>
              <a href={getHrefForTab('rate')} onClick={(e) => { e.preventDefault(); handleNav('rate'); }} className="hover:text-white transition-colors" title="Calculadora de Valor da Hora Trabalhada">
                Calculadora de Valor Hora
              </a>
            </li>
            <li>
              <a href={getHrefForTab('overtime')} onClick={(e) => { e.preventDefault(); handleNav('overtime'); }} className="hover:text-white transition-colors" title="Calculadora de Horas Extras 50% e 100%">
                Calculadora de Horas Extras
              </a>
            </li>
            <li>
              <a href={getHrefForTab('night')} onClick={(e) => { e.preventDefault(); handleNav('night'); }} className="hover:text-white transition-colors" title="Calculadora de Adicional Noturno">
                Calculadora de Adicional Noturno
              </a>
            </li>
            <li>
              <a href={getHrefForTab('escala12x36')} onClick={(e) => { e.preventDefault(); handleNav('escala12x36'); }} className="hover:text-white transition-colors" title="Calculadora de Escala 12x36 CLT">
                Escala 12x36 (Plantões)
              </a>
            </li>
            <li>
              <a href={getHrefForTab('faltas')} onClick={(e) => { e.preventDefault(); handleNav('faltas'); }} className="hover:text-white transition-colors" title="Calculadora de Faltas, Atrasos e DSR">
                Atrasos e Faltas (Perda DSR)
              </a>
            </li>
            <li>
              <a href={getHrefForTab('ferias')} onClick={(e) => { e.preventDefault(); handleNav('ferias'); }} className="hover:text-white transition-colors" title="Calculadora de Férias CLT 2026">
                Calculadora de Férias CLT
              </a>
            </li>
            <li>
              <a href={getHrefForTab('decimo')} onClick={(e) => { e.preventDefault(); handleNav('decimo'); }} className="hover:text-white transition-colors" title="Calculadora de 13º Salário 2026">
                Calculadora de 13º Salário
              </a>
            </li>
            <li>
              <a href={getHrefForTab('seguro')} onClick={(e) => { e.preventDefault(); handleNav('seguro'); }} className="hover:text-white transition-colors" title="Calculadora de Seguro-Desemprego 2026">
                Seguro-Desemprego
              </a>
            </li>
            <li>
              <a href={getHrefForTab('insalubridade')} onClick={(e) => { e.preventDefault(); handleNav('insalubridade'); }} className="hover:text-white transition-colors" title="Calculadora de Insalubridade e Periculosidade">
                Insalubridade e Periculosidade
              </a>
            </li>
            <li>
              <a href={getHrefForTab('cltpj')} onClick={(e) => { e.preventDefault(); handleNav('cltpj'); }} className="hover:text-white transition-colors" title="Comparador Salarial CLT vs PJ">
                Comparador CLT vs PJ
              </a>
            </li>
            <li>
              <a href={getHrefForTab('holerite')} onClick={(e) => { e.preventDefault(); handleNav('holerite'); }} className="hover:text-white transition-colors" title="Simulador de Holerite e Salário Líquido">
                Simulador de Holerite
              </a>
            </li>
            <li>
              <a href={getHrefForTab('rescisao')} onClick={(e) => { e.preventDefault(); handleNav('rescisao'); }} className="hover:text-white transition-colors" title="Calculadora de Rescisão Trabalhista CLT">
                Calculadora de Rescisão
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Resources & Articles */}
        <div>
          <h4 className="text-white font-bold mb-3 text-sm">Recursos e Guias</h4>
          <ul className="space-y-2">
            <li>
              <a href={getHrefForTab('excel')} onClick={(e) => { e.preventDefault(); handleNav('excel'); }} className="hover:text-white transition-colors text-emerald-400 font-semibold flex items-center gap-1" title="Baixar Planilha de Ponto em Excel Grátis">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Planilha Excel Grátis
              </a>
            </li>
            <li>
              <a href={getHrefForTab('blog')} onClick={(e) => { e.preventDefault(); handleNav('blog'); }} className="hover:text-white transition-colors" title="Guia Como calcular hora de trabalho">
                Como calcular hora de trabalho
              </a>
            </li>
            <li>
              <a href={getHrefForTab('blog')} onClick={(e) => { e.preventDefault(); handleNav('blog'); }} className="hover:text-white transition-colors" title="Guia Como calcular 44 horas de 2ª a 6ª">
                Como calcular 44 horas de 2ª a 6ª
              </a>
            </li>
            <li>
              <a href={getHrefForTab('blog')} onClick={(e) => { e.preventDefault(); handleNav('blog'); }} className="hover:text-white transition-colors" title="Guia Divisor de horas CLT 220">
                Divisor de horas CLT (220)
              </a>
            </li>
            <li>
              <a href={getHrefForTab('blog')} onClick={(e) => { e.preventDefault(); handleNav('blog'); }} className="hover:text-white transition-colors" title="Guia Cálculo de hora extra 50% e 100%">
                Cálculo de hora extra 50% e 100%
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Institutional & Legal Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-500" /> Institucional e Legal
          </h4>
          <ul className="space-y-2">
            <li>
              <a href={getHrefForTab('about')} onClick={(e) => { e.preventDefault(); handleNav('about'); }} className="hover:text-white transition-colors" title="Sobre Nós - Conheça nossa missão">
                Sobre Nós
              </a>
            </li>
            <li>
              <a href={getHrefForTab('contact')} onClick={(e) => { e.preventDefault(); handleNav('contact'); }} className="hover:text-white transition-colors" title="Fale Conosco - Atendimento">
                Contato
              </a>
            </li>
            <li>
              <a href={getHrefForTab('terms')} onClick={(e) => { e.preventDefault(); handleNav('terms'); }} className="hover:text-white transition-colors" title="Termos de Uso e Condições de Serviço">
                Termos de Uso
              </a>
            </li>
            <li>
              <a href={getHrefForTab('privacy')} onClick={(e) => { e.preventDefault(); handleNav('privacy'); }} className="hover:text-white transition-colors" title="Política de Privacidade e LGPD">
                Política de Privacidade
              </a>
            </li>
          </ul>
          <p className="text-neutral-500 text-[11px] leading-relaxed pt-2">
            Simulações baseadas na CLT (Decreto-Lei nº 5.452/1943). Ferramenta 100% gratuita para uso de trabalhadores, RH e contadores.
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-800 py-6 text-center text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} calculadoradehorastrabalhadas.org - Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 text-xs">
            Ferramenta desenvolvida para trabalhadores e RH no Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}
