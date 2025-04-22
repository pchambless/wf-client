import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box } from '@mui/material';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose'
});

class MermaidRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.mermaidRef = React.createRef();
    this.state = {
      chart: null
    };
  }

  componentDidMount() {
    this.renderMermaid();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chart !== this.props.chart) {
      this.renderMermaid();
    }
  }

  renderMermaid() {
    if (this.mermaidRef.current) {
      try {
        mermaid.render(`mermaid-${Date.now()}`, this.props.chart, (svgCode) => {
          this.setState({ chart: svgCode });
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        this.setState({ chart: `<pre>${this.props.chart}\n\nError: ${error.message}</pre>` });
      }
    }
  }

  render() {
    return (
      <div 
        ref={this.mermaidRef} 
        dangerouslySetInnerHTML={{ __html: this.state.chart || '' }}
      />
    );
  }
}

const MarkdownRenderer = ({ markdown }) => {
  return (
    <Box sx={{ p: 2 }}>
      <ReactMarkdown
        children={markdown}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            
            if (!inline && match && match[1] === 'mermaid') {
              return <MermaidRenderer chart={String(children).trim()} />;
            }
            
            return (
              <pre className={className} {...props}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      />
    </Box>
  );
};

export default MarkdownRenderer;
