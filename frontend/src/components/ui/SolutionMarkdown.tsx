import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SolutionMarkdownProps {
  content: string
  fontSize?: string
}

export function SolutionMarkdown({ content, fontSize = '0.75rem' }: SolutionMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              customStyle={{ borderRadius: '0.5rem', fontSize, margin: 0 }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-surface px-1 py-0.5 rounded text-accent">{children}</code>
          )
        },
        p({ children }) {
          return <p className="text-xs text-text-muted mb-1 last:mb-0">{children}</p>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
