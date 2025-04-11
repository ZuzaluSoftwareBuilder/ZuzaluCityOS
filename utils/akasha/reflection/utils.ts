import { ZulandReadableReflection } from '@/types/akasha';
import { ZulandLit } from '@/utils/lit';
import { AccessControlCondition } from '@/utils/lit/types';
import {
  AkashaReflectEdge,
  BlockLabeledValue,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { convertBlockContentToReadableBlock } from '../block/utils';
import { getProfileByDid } from '../profile';

export async function extractReadableReflections(
  reflections: AkashaReflectEdge[],
): Promise<
  {
    node: ZulandReadableReflection;
    cursor: string;
  }[]
> {
  const readableReflections = await Promise.all(
    reflections.map(async (reflection) => {
      return await extractReadableReflection(reflection);
    }),
  );
  return readableReflections;
}

export async function extractReadableReflection(
  reflection: AkashaReflectEdge,
): Promise<{
  node: ZulandReadableReflection;
  cursor: string;
}> {
  return {
    cursor: reflection.cursor,
    node: reflection.node
      ? {
          ...reflection.node,
          content: reflection.node.content.map((content: BlockLabeledValue) => {
            return convertBlockContentToReadableBlock(content);
          }),
          author:
            (await getProfileByDid(reflection.node.author.id)) ??
            reflection.node.author,
        }
      : null,
  } as {
    node: ZulandReadableReflection;
    cursor: string;
  };
}

export async function extractDecryptedReadableReflections(
  reflections: AkashaReflectEdge[],
  acc?: AccessControlCondition[],
): Promise<
  {
    node: ZulandReadableReflection;
    cursor: string;
  }[]
> {
  let readableReflections;
  if (!acc) {
    readableReflections = await Promise.all(
      reflections.map(async (reflection) => {
        return await extractReadableReflection(reflection);
      }),
    );
  } else {
    const chain = acc[0].chain;
    const zulandLit = new ZulandLit(chain);
    await zulandLit.connect();

    readableReflections = await Promise.all(
      reflections.map(async (reflection) => {
        return await extractDecryptedReadableReflection(reflection, {
          nodeClient: zulandLit,
          acc,
        });
      }),
    );
    await zulandLit.disconnect();
  }
  return readableReflections;
}

export async function extractDecryptedReadableReflection(
  reflection: AkashaReflectEdge,
  litParams: {
    nodeClient: ZulandLit;
    acc: AccessControlCondition[];
  },
): Promise<{
  node: ZulandReadableReflection;
  cursor: string;
}> {
  const tmp = {
    cursor: reflection.cursor,
    node: reflection.node
      ? {
          ...reflection.node,
          content: await Promise.all(
            reflection.node.content.map(async (content: BlockLabeledValue) => {
              let decryptedContent = content.value;
              let ciphertext = undefined;
              let dataToEncryptHash = undefined;
              try {
                const encryptedContent = JSON.parse(content.value) as {
                  ciphertext: string;
                  dataToEncryptHash: string;
                };
                ciphertext = encryptedContent.ciphertext;
                dataToEncryptHash = encryptedContent.dataToEncryptHash;
              } catch (error) {
                console.warn('Error parsing encrypted content', error);
              }
              if (ciphertext !== undefined && dataToEncryptHash !== undefined) {
                try {
                  decryptedContent = await litParams.nodeClient.decryptString(
                    ciphertext,
                    dataToEncryptHash,
                    litParams.acc,
                  );
                } catch (error) {
                  console.warn('Error decrypting content', error);
                }
              }
              return convertBlockContentToReadableBlock({
                ...content,
                value: decryptedContent,
              });
            }),
          ),
          author:
            (await getProfileByDid(reflection.node.author.id)) ??
            reflection.node.author,
        }
      : null,
  } as {
    node: ZulandReadableReflection;
    cursor: string;
  };
  return tmp;
}
