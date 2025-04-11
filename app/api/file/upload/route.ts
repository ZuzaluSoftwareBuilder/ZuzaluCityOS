import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { type Uploader3Connector } from '@lxdao/uploader3-connector';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

enum ErrorMessage {
  NO_IMAGE_DATA_OR_TYPE = 'No image data or type provided',
  FILE_SIZE_TOO_LARGE = 'File size exceeds 10MB limit',
  UPLOAD_FAILED = 'Failed to upload file',
}

export async function GET() {
  return Response.json({ message: 'get' }, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data: imageData = '', type } =
    body as Uploader3Connector.PostImageFile;

  if (!imageData || !type) {
    return Response.json(
      { error: ErrorMessage.NO_IMAGE_DATA_OR_TYPE },
      { status: 400 },
    );
  }

  let imageDataStr = imageData.startsWith('data:image/')
    ? imageData.replace(/^data:image\/\w+;base64,/, '')
    : imageData;
  const buffer = Buffer.from(imageDataStr, 'base64');

  if (buffer.byteLength > 10 * 1024 * 1024) {
    return Response.json(
      { error: ErrorMessage.FILE_SIZE_TOO_LARGE },
      { status: 400 },
    );
  }

  try {
    const fileExtension = type.split('/')[1] || 'jpg';
    const key = `uploads/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: type,
    });

    await s3Client.send(command);

    const fileUrl = `${process.env.R2_DOMAIN}/${key}`;

    return Response.json({ url: fileUrl }, { status: 200 });
  } catch (e) {
    console.error('Upload error:', e);
    return Response.json(
      { error: ErrorMessage.UPLOAD_FAILED },
      { status: 500 },
    );
  }
}
