import * as React from 'react';
import { useSlate } from 'slate-react';

import { Icon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { CustomEditor, TEXT_ALIGN_TYPES } from './helpers';

export type ToolbarButtonProps = {
  format: string;
  icon: React.ReactElement;
  style?: string;
};

export const BlockButton: React.FC<ToolbarButtonProps> = ({
  format,
  icon,
  style,
}) => {
  const editor = useSlate();
  const active = CustomEditor.isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );
  return (
    <IconButton
      onClick={(event) => {
        event.preventDefault();
        CustomEditor.toggleBlock(editor, format);
      }}
      sx={{
        width: '2rem',
        height: '2rem',
        ...(style && { [style]: true }),
        backgroundColor: active ? 'grey.500' : '',
        '&:hover, &.Mui-focusVisible': {
          backgroundColor: active ? 'grey.600' : '',
        },
      }}
    >
      <Icon>{icon}</Icon>
    </IconButton>
  );
};

export const MarkButton: React.FC<ToolbarButtonProps> = ({
  format,
  icon,
  style,
}) => {
  const editor = useSlate();
  const active = CustomEditor.isMarkActive(editor, format);
  return (
    <IconButton
      onClick={(event) => {
        event.preventDefault();
        CustomEditor.toggleMark(editor, format);
      }}
      sx={{
        width: '2rem',
        height: '2rem',
        ...(style && { [style]: true }),
        backgroundColor: active ? 'grey.500' : '',
        '&:hover, &.Mui-focusVisible': {
          backgroundColor: active ? 'grey.600' : '',
        },
      }}
    >
      <Icon>{icon}</Icon>
    </IconButton>
  );
};
