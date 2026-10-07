import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; message?: string }
interface State { failed: boolean }

export default class CalculatorErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State { return { failed: true }; }

  render() {
    if (this.state.failed) {
      return <div role="alert" className="p-6 space-y-3">
        <p>{this.props.message ?? 'Não foi possível abrir esta calculadora. Seus dados salvos não foram apagados.'}</p>
        <button type="button" onClick={() => window.location.reload()} className="bg-blue-600 text-white rounded-lg p-3">Tentar novamente</button>
      </div>;
    }
    return this.props.children;
  }
}
