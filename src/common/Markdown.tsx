import React from 'react';

import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import { createGlobalStyle } from 'styled-components';
import media from 'styled-media-query';
import breaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkDirective from 'remark-directive';
// import remarkDirectiveRehype from 'remark-directive-rehype';
import { SRLWrapper } from 'simple-react-lightbox';
interface MarkdownProps {
  content?: string;
  type?: string;
  linkDisabled?: boolean;
  offGlobalStyle?: boolean;
}

const srlWrapperOptions = {
  buttons: {
    showDownloadButton: false,
  },
};

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const linkDisabled = props.linkDisabled;
  const buttonRegex = new RegExp(':button');

  return (
    <SRLWrapper options={srlWrapperOptions}>
      {!props.offGlobalStyle && <MarkdownGlobalStyle type={props.type} />}
      <div className="markdown-body">
        <ReactMarkdown
          rehypePlugins={[
            rehypeRaw,
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                attributes: {
                  ...defaultSchema.attributes,
                  code: [
                    ...(defaultSchema.attributes?.code || []),
                    // List of all allowed languages:
                    ['className'],
                  ],
                },
              },
            ],
          ]}
          remarkPlugins={[
            breaks,
            remarkGfm,
            remarkDirective,
            // remarkDirectiveRehype,
          ]}
          components={{
            code: CodeBlock,
            a: ({ href, className, children }) => {
              return href && buttonRegex.test(href) ? (
                <div className="button">
                  <a href={href.replace(/:button/, '')} className={className} target="_blank">
                    {children}
                  </a>
                </div>
              ) : linkDisabled ? (
                <>{children}</>
              ) : (
                <a href={href} target="_blank">
                  {children}
                </a>
              );
            },
            h2: ({ children }) => {
              return <h2 id={`${children?.[0]?.toString().replace(/\s/g, '-')}`}>{children}</h2>;
            },
          }}
        >
          {props.content ? props.content : ''}
        </ReactMarkdown>
      </div>
    </SRLWrapper>
  );
};

export const MarkdownGlobalStyle = createGlobalStyle<{ type?: string }>`
  .markdown-body {
    text-align: left;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    color: #333;
    font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif;
    font-size: .875rem;
    line-height: 1.6;
    word-wrap: break-word;
    ${(props) => (props.type !== 'program' ? 'overflow: hidden;' : '')}
  }

  .markdown-body * {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 1em;
  }

  .markdown-body>:first-child {
    margin-top: 0!important;
  }

  .markdown-body>:last-child {
    margin-bottom: 0!important;
  }

  .markdown-body a {
    background: 0 0;
    color: #4183c4;
    text-decoration: none;
  }

  .markdown-body a:active, .markdown-body a:hover {
    outline: 0;
  }

  .markdown-body a:active, .markdown-body a:focus, .markdown-body a:hover {
    text-decoration: underline;
  }

  .markdown-body .button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .markdown-body .button a {
    display: block;
    padding: .75rem 1.5rem;
    background: #e33;
    border-radius: .375rem;
    box-shadow: .125rem .5rem .75rem rgba(0,0,0,.15);
    color: #fff;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: .02em;
  }

  .markdown-body .button a:active, .markdown-body .button a:focus, .markdown-body .button a:hover {
    box-shadow: .125rem .125rem .125rem rgba(0,0,0,.15);
    text-decoration: none;
    transform: translateY(.125rem);
  }

  .markdown-body strong {
    font-weight: 700;
  }

  .markdown-body em {
    font-style: italic;
  }

  .markdown-body img {
    cursor: pointer;
  }

  .markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul {
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: .875rem;
    line-height: 2;
  }

  ${(props) =>
    props.type === 'program'
      ? `
        .markdown-body pre {
          margin: 0 -2rem 2rem;
        }
      `
      : ''}

  ${(props) =>
    props.type === 'program'
      ? media.lessThan('medium')`
        .markdown-body pre {
          margin: 0 -1rem 2rem;
        }
      `
      : ''}

  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
    font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif;
    position: relative;
    margin-top: 3em;
    margin-bottom: 2rem;
    font-weight: 700;
  }

  .markdown-body h1 {
    font-size: 2.25rem;
    line-height: 2.75rem;
    text-align: center;
  }

  .markdown-body h2 {
    padding: 0 .75rem .375rem;
    border-bottom: 1px solid #eb0000;
    font-size: 1.5rem;
    line-height: 2.5rem;
  }

  .markdown-body h3 {
    padding-left: .5rem;
    border-left: 3px solid #eb0000;
    font-size: 1.25rem;
    line-height: 1.625rem;
  }

  .markdown-body h4 {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  ${media.lessThan('medium')`
    .markdown-body h1 {
      font-size: 1.5rem;
      line-height: 1.4;
    }

    .markdown-body h2 {
      padding: 0 .5rem .375rem;
      font-size: 1.3125rem;
      line-height: 1.625rem;
    }

    .markdown-body h3 {
      padding-left: 1rem;
      line-height: 1.875rem;
    }

    .markdown-body h4 {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  `}

  .markdown-body code, .markdown-body kbd, .markdown-body pre {
    font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  .markdown-body code {
    padding: .2em 0;
    margin: 0;
    font-size: 85%;
    background-color: rgba(0, 0, 0, .04);
    border-radius: 3px;
  }

  .markdown-body code:after, .markdown-body code:before {
    letter-spacing: -.2em;
    content: ' ';
  }

  .markdown-body pre {
    word-wrap: normal;
    overflow: auto;
    font-size: 0.875rem;
    line-height: 1.8;
    ${(props) => (props.type !== 'program' ? 'border-radius: 3px;' : '')}
  }

  .markdown-body pre code {
    display: inline-block;
    max-width: initial;
    padding: 0;
    margin: 0;
    overflow: initial;
    line-height: inherit;
    word-wrap: normal;
    background: 0 0;
  }

  .markdown-body pre code:after, .markdown-body pre code:before {
    content: normal;
  }

  .markdown-body pre>code {
    font-size: 1em;
    word-break: normal;
    white-space: pre;
    border: 0;
  }

  .markdown-body pre * {
    font-size: 1em;
  }

  .markdown-body kbd {
    background-color: #e7e7e7;
    background-image: -webkit-linear-gradient(#fefefe, #e7e7e7);
    background-image: linear-gradient(#fefefe, #e7e7e7);
    background-repeat: repeat-x;
    display: inline-block;
    padding: 5px 5px 1px;
    margin: 0 1px;
    font-size: 11px;
    line-height: 10px;
    color: #000;
    border: 1px solid #cfcfcf;
    border-radius: 2px;
    box-shadow: 0 1px 0 #ccc;
  }

  .markdown-body hr:after, .markdown-body hr:before {
    display: table;
    content: '';
  }

  .markdown-body input {
    color: inherit;
    font: inherit;
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    font-family: Helvetica, Arial, freesans, clean, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  .markdown-body input[disabled] {
    cursor: default;
  }

  .markdown-body input[type=checkbox] {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
  }

  .markdown-body blockquote {
    margin: 0 0 16px;
    padding: 0 15px;
    color: #777;
    border-left: 4px solid #ddd;
  }

  .markdown-body blockquote>:first-child {
    margin-top: 0;
  }

  .markdown-body blockquote>:last-child {
    margin-bottom: 0;
  }

  .markdown-body img {
    border: 0;
    max-width: 100%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .markdown-body hr {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    overflow: hidden;
    background: #e7e7e7;
    height: 4px;
    padding: 0;
    margin: 16px 0;
    border: 0;
  }

  .markdown-body hr:after {
    clear: both;
  }

  .markdown-body td, .markdown-body th {
    padding: 0;
  }

  .markdown-body table {
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    width: 100%;
    overflow: auto;
    word-break: normal;
    word-break: keep-all;
  }

  .markdown-body table td, .markdown-body table th {
    padding: 6px 13px;
    border: 1px solid #ddd;
  }

  .markdown-body table th {
    font-weight: 700;
  }

  .markdown-body table tr {
    background-color: #fff;
    border-top: 1px solid #ccc;
  }

  .markdown-body table tr:nth-child(2n) {
    background-color: #f8f8f8;
  }

  .markdown-body ol, .markdown-body ul {
    padding: 0 0 0 2em;
  }

  .markdown-body ol ol, .markdown-body ul ol {
    list-style-type: lower-roman;
  }

  .markdown-body ol ol, .markdown-body ol ul, .markdown-body ul ol, .markdown-body ul ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  .markdown-body ol ol ol, .markdown-body ol ul ol, .markdown-body ul ol ol, .markdown-body ul ul ol {
    list-style-type: lower-alpha;
  }

  .markdown-body li {
    list-style: square;
  }

  .markdown-body ol li {
    list-style-type: decimal;
  }

  .markdown-body li>p {
    margin-top: 16px;
  }

  .markdown-body dd {
    margin-left: 0;
  }

  .markdown-body dl {
    padding: 0;
  }

  .markdown-body dl dt {
    padding: 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: 700;
  }

  .markdown-body dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
  }
`;
