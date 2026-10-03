import { Component, ReactNode } from 'react';
export default class CalculatorErrorBoundary extends Component<{ children: ReactNode; message?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div role="alert" className="p-6 space-y-3"><p>{this.props.message ?? 'Não foi possível abrir esta calculadora. Seus dados salvos não foram apagados.'}</p><button onClick={() => window.location.reload()} className="bg-blue-600 text-white rounded-lg p-3">Tentar novamente</button></div>;
    return this.props.children;
  }
}
