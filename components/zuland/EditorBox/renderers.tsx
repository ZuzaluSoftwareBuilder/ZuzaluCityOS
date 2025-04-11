import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

/*
 ** A workaround for a chromium bug that incorrectly positions a cursor inside an inline element
 ** It helps during a step out of an inline element
 ** https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
 */
const InlineChromiumBugfix = () => (
  <span contentEditable={false} className="text-[0]">
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const allowedSchemes = ['http:', 'https:', 'mailto:', 'tel:'];

const MentionElement = (props: any) => {
  const { handleMentionClick, attributes, element, children } = props;
  const mention = element.name || element.did;
  const displayedMention = `${mention && mention.startsWith('@') ? mention : `@${mention}`} `;
  return (
    <Button
      sx={{
        color: (theme) => theme.palette.secondary.light,
        textAlign: element.align,
        '&.MuiButton-root': {
          padding: 0,
          minWidth: 'auto',
        },
      }}
      {...attributes}
      contentEditable={false}
      onClick={(ev: React.MouseEvent) => {
        handleMentionClick(element.did);
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      {displayedMention}
      {children}
    </Button>
  );
};

const LinkElement = ({
  attributes,
  children,
  element,
  handleLinkClick,
}: any) => {
  // If you allow untrusted input in the href attribute of a hyperlink, attackers can use
  // the javascript:, data: or vbscript: schemes to hijack your users.
  // Mitigate by parsing the URL and checking against an allow list
  const safeUrl = React.useMemo(() => {
    let parsedUrl: URL | null = null;
    try {
      parsedUrl = new URL(element.url);
    } catch (err) {
      console.error(err);
    }
    if (parsedUrl && allowedSchemes.includes(parsedUrl.protocol)) {
      return parsedUrl.href;
    }
    return 'about:blank';
  }, [element.url]);

  return (
    <Link
      sx={(theme) => ({
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.secondary.dark
            : theme.palette.secondary.light,
        textDecoration: 'none',
        textAlign: element.align,
      })}
      {...attributes}
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(ev: React.MouseEvent) => {
        if (new URL(element.url).origin === window.location.origin) {
          handleLinkClick(element.url);
          ev.stopPropagation();
          ev.preventDefault();
          return false;
        }
        return ev.stopPropagation();
      }}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </Link>
  );
};

const renderElement = (
  props: RenderElementProps,
  handleMentionClick?: (id: string) => void,
  handleTagClick?: (name: string) => void,
  handleLinkClick?: (url: string) => void,
) => {
  switch (props.element.type) {
    case 'mention':
      return (
        <MentionElement handleMentionClick={handleMentionClick} {...props} />
      );
    case 'link':
      return <LinkElement handleLinkClick={handleLinkClick} {...props} />;
    case 'list-item':
      return (
        <ListItem
          sx={(theme) => ({
            color: theme.palette.common.white,
            textAlign: props.element.align,
            display: 'list-item',
          })}
          {...props.attributes}
        >
          <ListItemText>{props.children}</ListItemText>
        </ListItem>
      );
    case 'bulleted-list':
      return (
        <List
          sx={{
            listStyleType: 'disc',
            textAlign: props.element.align,
          }}
          {...props.attributes}
        >
          {props.children}
        </List>
      );
    case 'numbered-list':
      return (
        <List
          sx={{
            listStyleType: 'decimal',
            textAlign: props.element.align,
          }}
          {...props.attributes}
        >
          {props.children}
        </List>
      );

    default:
      return (
        <Typography
          component="p"
          sx={(theme) => ({
            color: theme.palette.common.white,
            textAlign: props.element.align,
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          })}
          {...props.attributes}
        >
          {props.children}
        </Typography>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <Box
      component="span"
      sx={(theme) => ({
        color: leaf.disabled ? theme.palette.text.disabled : 'inherit',
      })}
      {...attributes}
    >
      {children}
    </Box>
  );
};

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

export { renderElement, renderLeaf };
