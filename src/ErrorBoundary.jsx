import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, maxWidth: 900 }}>
          <h2>画面エラーが発生しました</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <details style={{ marginTop: 12 }}>
            <summary>詳細</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error?.stack}
              {"\n\n"}
              {this.state.info?.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
