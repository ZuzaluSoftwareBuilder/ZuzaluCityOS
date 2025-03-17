import React from 'react';
import { Button, Input, Card, CardBody } from '@/components/base';
import SuperEditor from '@/components/editor/SuperEditor';
import FormUploader from '@/components/form/FormUploader';
import { MarkdownIcon } from '@/components/icons/Markdown';
import { CareRightIcon } from '@/components/icons/CareRight';
import { XIcon } from '@/components/icons/X';
const ProfileContent = () => (
    <div className="space-y-8">
        <div className="space-y-2">
            <h2 className="text-xl font-bold">Community Profile</h2>
            <p className="text-base text-white/80">Let's begin with the basics for your community</p>
        </div>
        <Card radius="md" className="bg-white/[0.02] border border-white/[0.1]  p-[20px] space-y-[40px]">
            {/* 社区名称 */}
            <div className="space-y-4">
                <label className="block text-base font-medium">Community Name*</label>
                <Input
                    placeholder="Give your space an awesome name"
                />
            </div>
            {/* 社区标语 */}
            <div className="space-y-4">
                <label className="block text-base font-medium">Community Tagline*</label>
                <Input
                    placeholder="Write a short, one-sentence tagline"
                />
                <div className="text-right text-[10px] text-white/70">00 Characters Left</div>
            </div>

            {/* 社区描述 */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-base font-medium">Community Description*</label>
                    <p className="text-sm text-white/60">This is a description or greeting for new members. You can also update descriptions later.</p>
                </div>
                <div className="space-y-2">
                    <SuperEditor
                        placeholder={
                            'This is a description greeting for new members. You can also update descriptions.'
                        }
                    />
                    <div className='flex items-center gap-[6px]'>
                        <MarkdownIcon />
                        <div className='text-sm text-white/60'>Markdown Available</div>
                    </div>
                </div>

            </div>
            {/* 空间头像 */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-base font-medium">Space Avatar*</label>
                    <p className="text-sm text-white/60">Recommend min of 200x200px (1:1 Ratio). Supported Formats: JPG, PNG, GIF</p>
                </div>
                <div className="flex items-center gap-5">
                    <FormUploader
                        value={''}
                        onChange={() => { }}
                        previewStyle={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                        }}
                    />
                    <Button
                        color="secondary"
                        size="sm"
                    >
                        Upload
                    </Button>
                </div>
            </div>

            {/* 空间横幅 */}
            <div className="space-y-4">
                <label className="block text-base font-medium">Space Banner*</label>
                <div className="w-full h-[200px] bg-white/[0.05] border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2">
                    <span className="text-white/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <p className="text-sm text-white/60">Recommend min of 730x220. Supported Formats: JPG, PNG</p>
                    <Button
                        color="secondary"
                        size="sm"
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </Card>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2.5">
            <Button
                color="secondary"
                size="md"
                className="w-[120px]"
                startContent={<XIcon />}
            >
                Discard
            </Button>
            <Button
                color="primary"
                size="md"
                className="w-[120px] bg-[rgba(103,219,255,0.1)] border border-[rgba(103,219,255,0.2)] text-[#67DBFF]"
                endContent={<CareRightIcon />}
            >
                Next
            </Button>
        </div>
    </div>
);

export default ProfileContent;
