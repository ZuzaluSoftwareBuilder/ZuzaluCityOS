import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { useRef, useState } from 'react';
import { once } from 'lodash';
import he from 'he';
import jsesc from 'jsesc';

const escapeHtml = (text: string) => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '\\/')
    .replace(/(?<=&lt;[^&]*?)"/g, '\\"');
};

export const decodeOutputData = (value: any): OutputData => {
  if (typeof value !== 'string') return value;
  if (!value) return { time: 0, blocks: [] };
  try {
    const decodedHtml = he.decode(value);
    console.log('decodedHtml', decodedHtml);
    const data = JSON.parse(decodedHtml) as OutputData;
    if (data?.blocks) {
      data.blocks = data.blocks.map((block) => {
        if (block.data?.text) {
          block.data.text = block.data.text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\\"/g, '"')
            .replace(/\\\//g, '/');
        }
        return block;
      });
    }

    return data;
  } catch (e) {
    try {
      const processed = jsesc(value, {
        json: true,
        wrap: false,
      });
      console.log('processed', processed);
      return JSON.parse(processed);
    } catch {
      return JSON.parse(value);
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
