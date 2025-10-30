import { createRoot, Root } from 'react-dom/client';
import { CaseInfoSummary } from './CaseInfoSummary.tsx';

class CaseInfoSummaryComponent extends HTMLElement {
  private _root: Root;
  private _caseId: string | undefined;
  private _urn: string | undefined;

  static get observedAttributes() {
    return ['caseid', 'urn'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._root = createRoot(this.shadowRoot!);
  }

  attributeChangedCallback(
      name: string,
      _oldValue: string | undefined,
      newValue: string | undefined
  ) {
    switch (name) {
      case 'caseid':
        this._caseId = newValue;
        return;

      case 'urn':
        this._urn = newValue;
        return;
    }

    this.render();
  }

  render() {
    if (this._caseId && this._urn) {
      this._root.render(
          <CaseInfoSummary caseId={this._caseId} urn={this._urn} />
      );
    }
  }

  connectedCallback() {
    this.render();
  }
}

if (!window.customElements.get('case-info-summary')) {
  window.customElements.define('case-info-summary', CaseInfoSummaryComponent);
}
