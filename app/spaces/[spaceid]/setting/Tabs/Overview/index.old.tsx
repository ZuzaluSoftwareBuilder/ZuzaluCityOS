//备份，需求完成后删除
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { ZuInput, ZuButton } from '@/components/core';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space } from '@/types';
import { useEditorStore } from '@/components/editor/useEditorStore';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import { createUrlWhenEdit } from '@/services/url';
import { covertNameToUrlName } from '@/utils/format';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { SOCIAL_TYPES } from '@/constant';
import { useDialog } from '@/components/dialog/DialogContext';
import dynamic from 'next/dynamic';
import FormUploader from '@/components/form/FormUploader';
const SuperEditor = dynamic(() => import('@/components/editor/SuperEditor'), {
  ssr: false,
});

const Overview = () => {
  const params = useParams();
  const { composeClient } = useCeramicContext();

  const [space, setSpace] = useState<Space>();
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [avatar, setAvatar] = useState('');
  const [banner, setBanner] = useState('');
  const router = useRouter();
  const descriptionEditorStore = useEditorStore();

  const [socialLinks, setSocialLinks] = useState<number[]>([0]);
  const [customLinks, setCustomLinks] = useState<number[]>([0]);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const customLinksRef = useRef<HTMLDivElement>(null);

  const [socialLinksData, setSocialLinksData] = useState<{
    [key: string]: string;
  }>({});
  const [customLinksData, setCustomLinksData] = useState<
    { title: string; url: string }[]
  >([]);
  const { showDialog, hideDialog } = useDialog();

  const getSpace = useCallback(async () => {
    try {
      const response: any = await composeClient.executeQuery(
        `
        query GetZucitySpace($id: ID!) {
          node(id: $id) {
            ...on ZucitySpace {
              id
              avatar
              banner
              description
              name
              profileId
              tagline
              website
              twitter
              telegram
              nostr
              lens
              github
              discord
              ens
              customLinks {
                title
                links
              }
            }
          }
        }
      `,
        { id: params.spaceid },
      );

      const editSpace: Space = response.data.node as Space;
      setSpace(editSpace);
      setName(editSpace.name);
      setAvatar(editSpace.avatar ?? '');
      setBanner(editSpace.banner ?? '');
      descriptionEditorStore.setValue(editSpace.description);
      setTagline(editSpace.tagline);

      const socialData: { [key: string]: string } = {};
      SOCIAL_TYPES.forEach((type) => {
        const value = editSpace[type.key as keyof Space];
        if (value && typeof value === 'string' && value.trim() !== '') {
          socialData[type.key] = value;
        }
      });

      const existingLinksCount = Object.keys(socialData).length;
      if (existingLinksCount > 0) {
        setSocialLinksData(socialData);
        setSocialLinks(Array.from({ length: existingLinksCount }, (_, i) => i));
      }

      if (editSpace.customLinks && editSpace.customLinks.length > 0) {
        setCustomLinksData(
          editSpace.customLinks.map((link) => ({
            title: link.title,
            url: link.links,
          })),
        );
        setCustomLinks(
          Array.from({ length: editSpace.customLinks.length }, (_, i) => i),
        );
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  }, []);

  const updateSpace = useCallback(
    async (data: {
      id: string;
      name: string;
      tagline: string;
      avatar: string;
      banner: string;
      description: string;
      github?: string;
      twitter?: string;
      telegram?: string;
      nostr?: string;
      lens?: string;
      discord?: string;
      ens?: string;
      customLinks?: { title: string; links: string }[];
    }) => {
      try {
        showDialog({
          title: 'Updating',
          message: 'Updating your space information...',
        });

        const { id, ...contentData } = data;

        const query = `
          mutation UpdateZucitySpace($i: UpdateZucitySpaceInput!) {
            updateZucitySpace(input: $i) {
              document {
                id
              },
            }
          }
        `;

        const response = await composeClient.executeQuery(query, {
          i: {
            id: id,
            content: contentData,
          },
        });

        if (data.name !== space?.name) {
          const urlName = covertNameToUrlName(data.name);
          await createUrlWhenEdit(urlName, data.id, 'spaces');
        }
        await getSpace();

        showDialog({
          title: 'Succesfully updated',
          message: 'Your space information has been updated',
          onConfirm: () => {
            hideDialog();
          },
        });
      } catch (error) {
        console.error('Failed to update space:', error);
        showDialog({
          title: 'Failed to update',
          message: 'Failed to update space information: ' + error,
          onConfirm: () => {
            hideDialog();
          },
        });
      }
    },
    [space?.name, showDialog, getSpace],
  );

  useEffect(() => {
    getSpace().catch((error) => {
      console.error('An error occurred:', error);
    });
  }, []);

  const save = () => {
    const baseData = {
      id: space!.id,
      name,
      tagline,
      avatar,
      banner,
      description: descriptionEditorStore.getValueString(),
    };

    const socialData = Object.entries(socialLinksData).reduce(
      (acc, [key, value]) => {
        if (value?.trim()) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const customLinksField =
      customLinksData.length > 0
        ? {
            customLinks: customLinksData.map((link) => ({
              title: link.title,
              links: link.url,
            })),
          }
        : {};

    const data = {
      ...baseData,
      ...socialData,
      ...customLinksField,
    };
    updateSpace(data)
      .then((res) => {
        console.info('Space updated:', res);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };
  const deleteSpace = async () => {
    showDialog({
      title: 'Delete Space',
      message:
        'This action cannot be undone. Are you sure you want to delete this space?',
      confirmText: 'Delete',
      showActions: true,
      onConfirm: async () => {
        try {
          showDialog({
            title: 'Deleting',
            message: 'Deleting your space...',
            showActions: false,
          });

          const enableIndexingSpaceMutation = `mutation enableIndexingZucitySpace($input: EnableIndexingZucitySpaceInput!) {
            enableIndexingZucitySpace(input: $input) {
              document {
                id
              }
            }
          }`;

          const response = await composeClient.executeQuery(
            enableIndexingSpaceMutation,
            {
              input: {
                id: params.spaceid,
                shouldIndex: false,
              },
            },
          );

          showDialog({
            title: 'Successfully Deleted',
            message: 'Your space has been deleted',
            showActions: true,
            confirmText: 'OK',
            onConfirm: () => {
              hideDialog();
              router.push('/');
            },
          });
        } catch (error) {
          console.error('Failed to delete space:', error);
          showDialog({
            title: 'Failed to Delete',
            message: 'An error occurred while deleting the space',
            showActions: true,
            confirmText: 'OK',
          });
        }
      },
    });
  };

  const handleAddSocialLink = () => {
    if (socialLinks.length === 0) {
      setSocialLinks([0]);
      return;
    }
    const nextItem = Math.max(...socialLinks);
    const temp = [...socialLinks, nextItem + 1];
    setSocialLinks(temp);
  };

  const handleRemoveSociaLink = (index: number) => {
    const temp = socialLinks.filter((item) => item !== index);
    setSocialLinks(temp);
  };

  const handleAddCustomLink = () => {
    if (customLinks.length === 0) {
      setCustomLinks([0]);
      return;
    }
    const nextItem = Math.max(...customLinks);
    const temp = [...customLinks, nextItem + 1];
    setCustomLinks(temp);
  };

  const handleRemoveCustomLink = (index: number) => {
    const temp = customLinks.filter((item) => item !== index);
    setCustomLinks(temp);
  };

  return (
    <Stack
      spacing="20px"
      padding="20px"
      sx={{ width: '100%', maxWidth: 762, margin: '0 auto', gap: '10px' }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Stack>
          <Typography fontSize={'18px'} fontWeight={700} marginBottom={'10px'}>
            Space Name
          </Typography>
          <ZuInput
            placeholder="Type an awesome name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Stack sx={{ gap: '10px' }}>
          <Typography fontSize={'18px'} fontWeight={700}>
            Space Tagline
          </Typography>
          <ZuInput
            placeholder="Write a short, one-sentence tagline for your event"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            multiline
            minRows={3}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Typography variant={'caption'} color="white">
              3 characters available
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Description
        </Typography>
        {/* why?  first render is empty */}
        {descriptionEditorStore.value ? (
          <>
            <SuperEditor
              placeholder="This is a description greeting for new members. You can also update
          descriptions."
              value={descriptionEditorStore.value}
              onChange={(val) => {
                descriptionEditorStore.setValue(val);
              }}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Typography variant={'caption'} color="white">
                {5000 - descriptionEditorStore.length} Characters Left
              </Typography>
            </Stack>
          </>
        ) : (
          <Skeleton
            variant="rectangular"
            height={270}
            sx={{ backgroundColor: '#ffffff0d', borderRadius: '10px' }}
          />
        )}
        {/* <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <svg
            width="20"
            height="15"
            viewBox="0 0 20 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_4575_7884)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.80085 4.06177H2.83984V11.506H4.88327V7.3727L6.82879 10.0394L8.68199 7.3727V11.506H10.6226V4.06177H8.68199L6.82879 6.81714L4.80085 4.06177ZM1.55636 0.794922H18.4436C19.3028 0.794922 20 1.59076 20 2.57247V13.0174C20 13.9989 19.3032 14.7949 18.4436 14.7949H1.55636C0.697166 14.7949 0 13.9991 0 13.0174V2.57247C0 1.59091 0.696805 0.794922 1.55636 0.794922ZM14.0078 4.10603H13.9884V7.92826H12.1206L15 11.506L17.8795 7.90628H15.9347V4.10603H14.0078Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_4575_7884">
                <rect
                  width="20"
                  height="14"
                  fill="white"
                  transform="translate(0 0.794922)"
                />
              </clipPath>
            </defs>
          </svg>
          <Typography>Markdown Available</Typography>
        </Stack> */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Avatar
        </Typography>
        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
          200 x 200 Min. (1:1 Ratio) Upload PNG, GIF or JPEG
        </Typography>

        <FormUploader
          value={avatar}
          onChange={setAvatar}
          previewStyle={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={'18px'} fontWeight={700} lineHeight={'120%'}>
          Space Main Banner
        </Typography>
        <Typography fontSize={'13px'} fontWeight={500} lineHeight={'140%'}>
          Recommend min of 730x220 Accept PNG GIF or JPEG
        </Typography>

        <FormUploader
          value={banner}
          onChange={setBanner}
          previewStyle={{
            width: '100%',
            height: '200px',
            borderRadius: '10px',
          }}
        />
      </Box>

      <Box bgcolor="#2d2d2d" borderRadius="10px">
        <Box padding="20px" display="flex" justifyContent="space-between">
          <Typography variant="subtitleMB" color="text.secondary">
            Links
          </Typography>
        </Box>

        <Box
          padding={'20px'}
          display={'flex'}
          flexDirection={'column'}
          gap={'30px'}
          ref={socialLinksRef}
        >
          <Typography variant="subtitleSB" color="text.secondary">
            Social Links
          </Typography>
          {socialLinks.map((item, index) => {
            const socialKey = Object.keys(socialLinksData)[index];
            return (
              <Box
                display={'flex'}
                flexDirection={'row'}
                gap={'20px'}
                key={index}
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'10px'}
                  flex={1}
                >
                  <Typography variant="subtitle2" color="white">
                    Select Social
                  </Typography>
                  <Select
                    placeholder="Select"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: '#222222',
                        },
                      },
                    }}
                    sx={{
                      '& > div': {
                        padding: '8.5px 12px',
                        borderRadius: '10px',
                      },
                    }}
                    value={socialKey || ''}
                    onChange={(e) => {
                      const newSocialData = { ...socialLinksData };
                      delete newSocialData[socialKey];
                      newSocialData[e.target.value] = '';
                      setSocialLinksData(newSocialData);
                    }}
                  >
                    {SOCIAL_TYPES.map((social, idx) => (
                      <MenuItem value={social.key} key={idx}>
                        {social.value}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'10px'}
                  flex={1}
                >
                  <Typography variant="subtitle2" color="white">
                    URL
                  </Typography>
                  <TextField
                    variant="outlined"
                    placeholder="https://"
                    sx={{
                      '& > div > input': {
                        padding: '8.5px 12px',
                      },
                    }}
                    value={socialLinksData[socialKey] || ''}
                    onChange={(e) => {
                      setSocialLinksData({
                        ...socialLinksData,
                        [socialKey]: e.target.value,
                      });
                    }}
                  />
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'flex-end'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveSociaLink(item)}
                >
                  <Box
                    sx={{
                      borderRadius: '10px',
                      width: '40px',
                      height: '40px',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <CancelIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Button
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              textTransform: 'unset',
              color: 'white',
            }}
            onClick={handleAddSocialLink}
          >
            <AddCircleIcon />
            <Typography variant="buttonMSB" color="white">
              Add Social Link
            </Typography>
          </Button>
        </Box>
        <Box
          padding={'20px'}
          display={'flex'}
          flexDirection={'column'}
          gap={'30px'}
          borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          ref={customLinksRef}
        >
          <Typography variant="subtitleSB" color="text.secondary">
            Custom Links
          </Typography>
          {customLinks.map((item, index) => {
            const customLink = customLinksData[index] || { title: '', url: '' };
            return (
              <Box
                display={'flex'}
                flexDirection={'row'}
                gap={'20px'}
                key={index}
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'10px'}
                  flex={1}
                >
                  <Typography variant="subtitle2" color="white">
                    Link Title
                  </Typography>
                  <TextField
                    variant="outlined"
                    placeholder="Type a name"
                    sx={{
                      '& > div > input': {
                        padding: '8.5px 12px',
                      },
                    }}
                    value={customLink.title}
                    onChange={(e) => {
                      const newCustomLinks = [...customLinksData];
                      newCustomLinks[index] = {
                        ...newCustomLinks[index],
                        title: e.target.value,
                      };
                      setCustomLinksData(newCustomLinks);
                    }}
                  />
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={'10px'}
                  flex={1}
                >
                  <Typography variant="subtitle2" color="white">
                    URL
                  </Typography>
                  <TextField
                    variant="outlined"
                    placeholder="https://"
                    sx={{
                      '& > div > input': {
                        padding: '8.5px 12px',
                      },
                    }}
                    value={customLink.url}
                    onChange={(e) => {
                      const newCustomLinks = [...customLinksData];
                      newCustomLinks[index] = {
                        ...newCustomLinks[index],
                        url: e.target.value,
                      };
                      setCustomLinksData(newCustomLinks);
                    }}
                  />
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'flex-end'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveCustomLink(item)}
                >
                  <Box
                    sx={{
                      borderRadius: '10px',
                      width: '40px',
                      height: '40px',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <CancelIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </Box>
            );
          })}

          <Button
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              textTransform: 'unset',
            }}
            onClick={handleAddCustomLink}
          >
            <AddCircleIcon />
            <Typography variant="buttonMSB" color="white">
              Add Custom Link
            </Typography>
          </Button>
        </Box>
      </Box>
      <Button
        sx={{
          color: '#67DBFF',
          borderRadius: '10px',
          backgroundColor: 'rgba(103, 219, 255, 0.10)',
          fontSize: '14px',
          padding: '6px 16px',
          flex: 1,
          border: '1px solid rgba(103, 219, 255, 0.20)',
          opacity: '1',
          '&:disabled': {
            opacity: '0.6',
            color: '#67DBFF',
          },
        }}
        startIcon={<SaveAsRoundedIcon />}
        onClick={save}
      >
        Save
      </Button>
      <ZuButton
        sx={{
          color: 'white',
          borderRadius: '10px',
          backgroundColor: 'red',
          fontSize: '14px',
          padding: '6px 16px',
          flex: 1,
          border: '1px solid rgba(103, 219, 255, 0.20)',
          opacity: '1',
          '&:disabled': {
            opacity: '0.6',
            color: '#67DBFF',
          },
        }}
        onClick={() => deleteSpace()}
      >
        Delete Space
      </ZuButton>
    </Stack>
  );
};

export default Overview;
