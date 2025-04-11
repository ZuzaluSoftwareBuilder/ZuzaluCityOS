import { PreviewFile } from '@/components';
import { Box, Button } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
  accept?: Array<'.png' | '.jpeg' | '.jpg' | '.gif' | '.svg'>;
  api?: string;
  multiple?: boolean;
  value?: string;
  previewStyle?: React.CSSProperties;
  onChange: (url: string) => void;
}

const compressImage = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          file.type,
          quality,
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const isGifImage = (file: File) => {
  return file.type === 'image/gif';
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
  });
};

const uploadImage = async (base64: string, api: string): Promise<string> => {
  try {
    const type = base64.split(';')[0].split('/')[1];

    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: base64,
        type: type,
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export default function FormUploader({
  accept = ['.jpg', '.jpeg', '.gif', '.png'],
  api = '/api/file/upload',
  multiple = false,
  value,
  onChange,
  previewStyle,
}: IProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setIsLoading(true);
        setErrorMessage(undefined);

        let finalFile: File;

        if (isGifImage(file) || file.size <= 1024 * 1024) {
          finalFile = file;
        } else {
          finalFile = await compressImage(file);
        }

        const base64Data = await fileToBase64(finalFile);

        setUrl(base64Data);

        const uploadedUrl = await uploadImage(base64Data, api);
        onChange(uploadedUrl);
      } catch (error) {
        console.error('File processing or upload failed:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'Upload failed',
        );
        setUrl(undefined);
      } finally {
        setIsLoading(false);
        event.target.value = '';
      }
    },
    [api, onChange],
  );

  useEffect(() => {
    if (!isLoading && url !== value) {
      setUrl(value);
    }
  }, [isLoading, url, value]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <input
        ref={fileInputRef}
        accept={accept.join(',')}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple={multiple}
      />
      <Button
        onClick={handleButtonClick}
        size="small"
        sx={{
          color: 'white',
          borderRadius: '10px',
          backgroundColor: '#373737',
          border: '1px solid #383838',
          width: '130px',
        }}
      >
        Upload Image
      </Button>
      <PreviewFile
        sx={{
          width: '200px',
          height: '200px',
          borderRadius: '10px',
          ...previewStyle,
        }}
        src={url}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    </Box>
  );
}
