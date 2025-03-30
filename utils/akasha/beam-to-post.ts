import { ZulandReadableBeam, ZulandReadbleBlock } from '@/types/akasha';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';
import { Descendant } from 'slate';

/**
 * Utility to convert Akasha Beam JSON to Markdown
 */
export interface Post {
  id: string;
  title: string;
  author: {
    akashaProfile: AkashaProfile;
    isViewer: boolean;
  };
  originalContent?: Descendant[];
  tags?: string[];
  createdAt: string;
  applicationID: string;
  eventId: string;
  likes?: number;
  replies?: number;
}

export const akashaBeamToMarkdown = (
  beams: ZulandReadableBeam[],
  eventId: string,
): Post[] => {
  if (!beams || beams.length === 0) {
    return [];
  }

  const posts: Post[] = [];

  for (const beam of beams) {
    const { title } = processBeam(beam);
    posts.push({
      id: beam.id,
      title: title,
      author: beam.author,
      originalContent: beam.content.flatMap((block) =>
        // we are saving akasha posts with the title in the first block, so we skip it
        block.content.slice(1).flatMap((value) => {
          if (
            value.propertyType === 'slate-block' &&
            typeof value.value === 'object'
          ) {
            return value.value;
          }
          return [];
        }),
      ),
      createdAt: beam.createdAt,
      applicationID: beam.appID,
      eventId: eventId,
      likes: 0,
      replies: beam.reflectionsCount,
      tags: beam.tags ? beam.tags.map((tag) => tag.value) : [],
    });
  }

  return posts;
};

const processBeam = (
  beam: ZulandReadableBeam,
): { title: string; body: string } => {
  let beamMarkdown = '';
  let beamTitle = '';
  for (const block of beam.content) {
    const { title, body } = processContentBlock(block);
    beamMarkdown += body;
    beamTitle = title;
  }

  return { title: beamTitle, body: beamMarkdown.trim() };
};

const processContentBlock = (
  block: ZulandReadbleBlock,
): { title: string; body: string } => {
  let blockMarkdown = '';
  let blockTitle = '';

  for (const contentItem of block.content) {
    let isTitle = contentItem.label === 'beam-title';
    switch (contentItem.propertyType) {
      case 'slate-block':
        for (const slateBlock of contentItem.value) {
          if (isTitle) {
            blockTitle = (
              slateBlock as unknown as {
                children: { text: string }[];
              }
            ).children[0].text;
            isTitle = false;
          }
          blockMarkdown += processSlateBlock(slateBlock);
        }
        break;
      case 'image-block': {
        const imgBlock = contentItem.value as unknown as {
          caption?: string;
          align?: string;
          images: {
            src: string;
            name: string;
            size: { width: number; height: number };
          }[];
        };
        blockMarkdown += processImages(imgBlock);
        break;
      }
    }
  }

  return { title: blockTitle, body: blockMarkdown };
};

const processSlateBlock = (blockLabeledValue: any): string => {
  let blockMarkdown = '';
  switch (blockLabeledValue.type) {
    case 'paragraph':
      blockMarkdown +=
        processParagraph(blockLabeledValue.children, blockLabeledValue.align) +
        '\n\n';
      break;
    case 'numbered-list':
      blockMarkdown += processNumberedList(blockLabeledValue.children) + '\n';
      break;
    case 'bulleted-list':
      blockMarkdown += processBulletedList(blockLabeledValue.children) + '\n';
      break;
  }

  return blockMarkdown;
};

const processParagraph = (
  node: {
    text: string;
    children?: any[];
    align?: string;
  }[],
  align?: string,
): string => {
  let text = '';
  for (const child of node) {
    switch (align) {
      case 'center':
        text =
          '<p style="text-align: center">' + processTextNode(child) + '</p>';
        break;
      case 'right':
        text =
          '<p style="text-align: right">' + processTextNode(child) + '</p>';
        break;
      default:
        text = processTextNode(child);
    }
    if (child.children) {
      for (const children of child.children) {
        text += processTextNode(children);
      }
    }
  }
  return text;
};

const processTextNode = (node: {
  text: string;
  bold?: string;
  italic?: string;
  underline?: string;
}): string => {
  let text = node.text;
  if (node.bold) text = `**${text}**`;
  if (node.italic) text = `*${text}*`;
  if (node.underline) text = `<ins>${text}</ins>`;
  return text;
};

const processNumberedList = (
  node:
    | {
        type: string;
        children: { type: string; children: { text: string }[] }[];
      }[]
    | null,
): string => {
  if (!node) {
    return '';
  }
  let markdown = '';
  node.forEach((item: any) => {
    if (item.children.length > 0) {
      item.children.forEach((child: any, i: number) => {
        markdown += `${i + 1}. ${child.text}\n`;
      });
    }
  });
  return markdown;
};

const processBulletedList = (
  node:
    | {
        type: string;
        children: { type: string; children: { text: string }[] }[];
      }[]
    | null,
): string => {
  if (!node) {
    return '';
  }
  let markdown = '';
  node.forEach((item: any) => {
    if (item.children.length > 0) {
      item.children.forEach((child: any) => {
        markdown += `- ${child.text}\n`;
      });
    }
  });
  return markdown;
};

const processImages = (imageData: {
  caption?: string;
  align?: string;
  images: {
    src: string;
    name: string;
    size: { width: number; height: number };
  }[];
}): string => {
  if (!imageData) {
    return '';
  }
  const alt = imageData.images[0].name || '';
  const caption = imageData.caption || '';
  let markdown = '';

  for (const img of imageData.images) {
    markdown += `<img src="${buildIpfsUrl(img.src)}" alt="${alt}" width="${img.size.width}" height="${img.size.height}" />`;
  }
  if (caption) {
    markdown += `\n*${caption}*`;
  }

  return markdown;
};

export const buildIpfsUrl = (ipfsUrl: string): string => {
  if (!ipfsUrl) return '';

  if (ipfsUrl.startsWith('ipfs://')) {
    const ipfsHash = ipfsUrl.split('ipfs://')[1];
    return `https://${ipfsHash}.ipfs.w3s.link`;
  }
  return ipfsUrl;
};
