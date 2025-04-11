import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { once } from 'lodash';
import { useRef, useState } from 'react';

const escapeHtml = (text: string) => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(?<=&lt;[^&]*?)"/g, '\\"')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
};

export const decodeOutputData = (value: any): OutputData => {
  if (typeof value !== 'string') return value;
  if (!value) return { time: 0, blocks: [] };
  try {
    const data = JSON.parse(escapeHtml(value)) as OutputData;
    if (data?.blocks) {
      data.blocks = data.blocks.map((block) => {
        if (block.data?.text) {
          block.data.text = block.data.text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\\"/g, '"');
        }
        return block;
      });
    }

    return data;
  } catch (e) {
    console.log('error', e);
    try {
      return JSON.parse(value);
    } catch (e) {
      return { time: 0, blocks: [] };
    }
  }
};

export const encodeOutputData = (data: any) => {
  if (!data) return JSON.stringify({});
  return JSON.stringify(data);
};

export const getOutputDataLength = (blocks?: OutputBlockData[]) => {
  if (Array.isArray(blocks) === false) return 0;
  return blocks
    .filter((block) => block.data && 'text' in block.data)
    .reduce((sum, current) => sum + current.data.text.length, 0);
};

export const useEditorStore = () => {
  const [value, setValue] = useState<OutputData>();
  const [length, setLength] = useState<number>(0);
  const initValue = useRef<OutputData>();

  /**
   * first call setValue will set the initial value
   */
  const onceSetFirstValue = once((value: OutputData) => {
    initValue.current = value;
  });

  return {
    value,
    getValueString: () => encodeOutputData(value!),
    setValue: (value: OutputData | string) => {
      const data = decodeOutputData(value);
      onceSetFirstValue(data);
      setValue(data);
      setLength(getOutputDataLength(data.blocks));
    },
    length,
    setLength,
    reset: () => {
      /**
       * reset the value to the initial value
       */
      const data = initValue.current;
      setValue(data);
      setLength(getOutputDataLength(data ? data.blocks : undefined));
    },
    clear: () => {
      setValue(undefined);
      setLength(0);
    },
  };
};
