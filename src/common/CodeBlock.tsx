import React, { useMemo, useState } from 'react';
import { CodeComponent, ReactMarkdownNames } from 'react-markdown/lib/ast-to-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

import { CopyBlock } from './components/codeBlock/CopyBlock';

// 先頭の差分表記(+と-)をトリミング
const trimDiffercence = (content: string): string => {
  const splitContents = content.split('\n');
  return splitContents.map((value) => value.replace(/^-|^\+/, ' ')).join('\n');
};

// 差分表記に言語が指定されている場合はその言語をシンタックスハイライトさせる
const getDifferenceLang = (lang: string) => {
  let result = '';
  if (lang.includes(':')) {
    result = lang.replace(/diff:/, '');
  }

  if (result !== '') {
    return result;
  }
  return 'diff';
};

// 差分表記(+と-)の数をカウント
const getDifferenceCount = (value: string, regexp: RegExp): number[] => {
  return value.split('\n').reduce<number[]>((acc, cur, i) => {
    return cur.match(regexp) ? [...acc, i + 1] : acc;
  }, []);
};

export const CodeBlock: CodeComponent | ReactMarkdownNames = ({
  inline,
  className,
  children,
  ...props
}) => {
  const language = className ? className.replace(/language-/, '') : '';
  const code = String(children);

  const addtionalLines = useMemo((): number[] => {
    return getDifferenceCount(code, /^\+/);
  }, [code]);

  const deletionalLines = useMemo((): number[] => {
    return getDifferenceCount(code, /^-/);
  }, [code]);

  // 画像のパスだけを取得する
  const trimImagePath = (imagePath: string): string => {
    return imagePath.replace(/!\[.+\]|\(|\)/g, '');
  };

  const trimImageAlt = (imagePath: string): string => {
    return imagePath.replace(/!\[|\]\(.+\)/g, '');
  };

  // 差分部分だけマーカー表示になるようにstyleを変更
  const differenceStyle = (lineNumber: number) => {
    const style = {
      styles: {
        display: 'block',
        backgroundColor: '',
      },
      class: '',
    };
    // const style = { display: 'block', backgroundColor: '' };
    switch (true) {
      case addtionalLines.includes(lineNumber):
        style.styles.backgroundColor = 'rgba(46,160,67,0.24)';
        style.class = 'add';
        break;
      case deletionalLines.includes(lineNumber):
        style.styles.backgroundColor = 'rgba(248,81,73,0.24)';
        style.class = 'remove';
        break;
    }
    return { style: style.styles, class: style.class };
  };

  const [isHover, setIsHover] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const clickCopy = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setIsCopied(true);
      })
      .catch(() => {
        //
      });
  };

  return inline ? (
    <code className={className} {...props}>
      {children}
    </code>
  ) : (
    <div>
      {language === 'vimeo' ? (
        <VideoArea>
          <iframe
            src={code}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </VideoArea>
      ) : language === 'google_slide' ? (
        <GoogleSlideArea>
          <iframe src={code} allowFullScreen />
        </GoogleSlideArea>
      ) : language === 'border_image' ? (
        <ImageArea>
          <img src={trimImagePath(code)} alt={trimImageAlt(code)} />
        </ImageArea>
      ) : language?.includes('diff') ? (
        <HighlightWrapper
          onMouseEnter={() => {
            setIsHover(true);
            setIsCopied(false);
          }}
          onMouseLeave={() => {
            setIsHover(false);
            setIsCopied(false);
          }}
        >
          <StyledSyntaxHighlighter
            PreTag="div"
            language={getDifferenceLang(language)}
            style={okaidia}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={differenceStyle}
          >
            {trimDiffercence(code)}
          </StyledSyntaxHighlighter>
          <CopyBlock isCopied={isCopied} display={isHover} onClick={clickCopy} />
        </HighlightWrapper>
      ) : (
        <HighlightWrapper
          onMouseEnter={() => {
            setIsHover(true);
            setIsCopied(false);
          }}
          onMouseLeave={() => {
            setIsHover(false);
            setIsCopied(false);
          }}
        >
          <StyledSyntaxHighlighter
            PreTag="div"
            language={language}
            style={okaidia}
            wrapLines={true}
            showLineNumbers={true}
          >
            {code}
          </StyledSyntaxHighlighter>
          <CopyBlock isCopied={isCopied} display={isHover} onClick={clickCopy} />
        </HighlightWrapper>
      )}
    </div>
  );
};

const HighlightWrapper = styled.div`
  position: relative;
`;
const StyledSyntaxHighlighter = styled(SyntaxHighlighter)`
  .add .linenumber,
  .remove .linenumber {
    position: relative;

    &:after {
      height: 1rem;
      margin: auto;
      color: #fff;
      line-height: 1rem;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0.125rem;
    }
  }
  .add .linenumber:after {
    content: '+';
  }
  .remove .linenumber:after {
    content: '-';
  }
`;

const VideoArea = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;

  iframe {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`;

const ImageArea = styled.div`
  display: inline-block;
  border: 2px solid lightgray;
  margin: 8px;
  img {
    vertical-align: bottom;
  }
`;

const GoogleSlideArea = styled.div`
  position: relative;
  overflow: hidden;
  margin: 15px 0 20px 0;
  padding-bottom: 50%;
  padding-top: 65px;
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;
