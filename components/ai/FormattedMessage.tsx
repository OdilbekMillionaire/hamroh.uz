import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="mt-1 mb-2 text-base font-bold text-[var(--text-primary)]">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-3 mb-1.5 text-sm font-bold text-[var(--text-primary)]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1 text-sm font-semibold text-[var(--text-primary)]">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-2 first:mt-0 last:mb-0 leading-6">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-2 space-y-1.5 pl-5 list-disc marker:text-[var(--primary)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 space-y-1.5 pl-5 list-decimal marker:font-semibold marker:text-[var(--primary)]">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-6">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
  em: ({ children }) => <em className="text-[var(--text-secondary)] not-italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-[var(--accent)] bg-[var(--accent-light)] px-3 py-2 text-[var(--text-secondary)]">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-96 border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-t border-[var(--border)] px-3 py-2 align-top">{children}</td>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-[var(--primary)] underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[var(--bg-muted)] px-1.5 py-0.5 text-[0.85em] text-[var(--text-primary)]">
      {children}
    </code>
  ),
};

interface FormattedMessageProps {
  content: string;
}

export default function FormattedMessage({ content }: FormattedMessageProps) {
  return (
    <div className="ai-message-content text-sm leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
