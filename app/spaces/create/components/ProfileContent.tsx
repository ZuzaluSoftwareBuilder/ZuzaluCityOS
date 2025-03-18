import React from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import { Image } from '@heroui/react';
import * as Yup from 'yup';
import { Button, Input, Card, CardBody, Avatar } from '@/components/base';
import SuperEditor from '@/components/editor/SuperEditor';
import { MarkdownIcon } from '@/components/icons/Markdown';
import { CareRightIcon } from '@/components/icons/CareRight';
import { XIcon } from '@/components/icons/X';
import PhotoUpload from '@/components/form/PhotoUpload';
import { PhotoIcon } from '@heroicons/react/24/outline'
// 定义表单数据类型
export interface ProfileFormData {
    communityName: string;
    communityTagline: string;
    communityDescription: {
        blocks: any[];
        time: number;
        version: string;
    };
    spaceAvatar: string;
    spaceBanner: string;
}

// 定义验证模式
export const ProfilValidationSchema = Yup.object().shape({
    communityName: Yup
        .string()
        .min(3, 'Name must be at least 3 characters.')
        .required('Name is required.'),
    communityTagline: Yup.string()
        .min(3, 'Tagline must be at least 3 characters.')
        .required('Tagline is required.'),
    communityDescription: Yup.object().shape({
        blocks: Yup.array().required(),
        time: Yup.number().required(),
        version: Yup.string().required(),
    }).required('社区描述是必填项'),
    spaceAvatar: Yup.string()
        .required('please upload space avatar'),
    spaceBanner: Yup.string()
        .required('please upload space banner'),
});

interface ProfileContentProps {
    form: UseFormReturn<ProfileFormData>;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ form }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = form;

    const onSubmit = async (data: ProfileFormData) => {
        try {
            console.log('Form data:', data);
            // TODO: 实现表单提交逻辑
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDiscard = () => {
        // TODO: 实现放弃编辑逻辑
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-xl font-bold">Community Profile</h2>
                <p className="text-base text-white/80">Let's begin with the basics for your community</p>
            </div>
            <Card radius="md" className="bg-white/[0.02] border border-white/[0.1] p-[20px] space-y-[40px]">
                {/* 社区名称 */}
                <div className="space-y-4">
                    <label className="block text-base font-medium">Community Name*</label>
                    <Controller
                        name="communityName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Give your space an awesome name"
                                isInvalid={!!errors.communityName}
                                errorMessage={errors.communityName?.message}
                            />
                        )}
                    />
                </div>

                {/* 社区标语 */}
                <div className="space-y-4">
                    <label className="block text-base font-medium">Community Tagline*</label>
                    <Controller
                        name="communityTagline"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Write a short, one-sentence tagline"
                                isInvalid={!!errors.communityTagline}
                                errorMessage={errors.communityTagline?.message}
                                maxLength={100}
                            />
                        )}
                    />
                    <div className="text-right text-[10px] text-white/70">
                        {watch('communityTagline')?.length || 0}/100 Characters
                    </div>
                </div>

                {/* 社区描述 */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-base font-medium">Community Description*</label>
                        <p className="text-sm text-white/60">This is a description or greeting for new members. You can also update descriptions later.</p>
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="communityDescription"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <SuperEditor
                                    value={value}
                                    onChange={onChange}
                                    placeholder="This is a description greeting for new members. You can also update descriptions."
                                />
                            )}
                        />
                        <div className='flex items-center gap-[6px]'>
                            <MarkdownIcon />
                            <div className='text-sm text-white/60'>Markdown Available</div>
                        </div>
                        {errors.communityDescription && (
                            <p className="text-red-500 text-sm">{errors.communityDescription.message}</p>
                        )}
                    </div>
                </div>

                {/* 空间头像 */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-base font-medium">Space Avatar*</label>
                        <p className="text-sm text-white/60">Recommend min of 200x200px (1:1 Ratio). Supported Formats: JPG, PNG, GIF</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <Controller
                            name="spaceAvatar"
                            control={control}
                            render={({ field }) => (
                                <PhotoUpload
                                    initialUrl={field.value}
                                    onUploadSuccess={field.onChange}
                                    api="/api/file/upload"
                                    className='rounded-full'
                                >
                                    <Avatar
                                        size="xlg"
                                        icon={<PhotoIcon className="w-8 h-8 opacity-30" />}
                                        src={field.value}
                                        alt="avatar"
                                        className="bg-transparent border border-dashed border-white/20"
                                    />
                                </PhotoUpload>
                            )}
                        />
                        {errors.spaceAvatar && (
                            <p className="text-red-500 text-sm">{errors.spaceAvatar.message}</p>
                        )}
                    </div>
                </div>

                {/* 空间横幅 */}
                <div className="space-y-4">
                    <label className="block text-base font-medium">Space Banner*</label>
                    <Controller
                        name="spaceBanner"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <PhotoUpload
                                initialUrl={value}
                                onUploadSuccess={onChange}
                                api="/api/file/upload"
                                className="w-full  h-[200px] mobile:h-[160px]  border border-dashed border-white/20 rounded-[10px]"
                                accept={['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']}
                            >
                                <div className='w-full'>
                                    {
                                        value ? (
                                            <Image
                                                src={value}
                                                alt="banner"
                                                width="100%"
                                                className='object-cover h-[200px] mobile:h-[160px]'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex flex-col items-center justify-center gap-2 py-[60px] mobile:[40px]'>
                                                <PhotoIcon className="w-8 h-8 opacity-30" />
                                                <p className="text-sm text-white/60">Recommend min of 730x220. Supported Formats: JPG, PNG</p>
                                            </div>
                                        )
                                    }
                                </div>


                            </PhotoUpload>
                        )}
                    />
                    {errors.spaceBanner && (
                        <p className="text-red-500 text-sm">{errors.spaceBanner.message}</p>
                    )}
                </div>
            </Card>

            {/* 底部按钮 */}
            <div className="flex justify-end gap-2.5">
                <Button
                    type="button"
                    color="secondary"
                    size="md"
                    className="w-[120px]"
                    startContent={<XIcon />}
                    onClick={handleDiscard}
                >
                    Discard
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    size="md"
                    className="w-[120px] bg-[rgba(103,219,255,0.1)] border border-[rgba(103,219,255,0.2)] text-[#67DBFF]"
                    endContent={<CareRightIcon />}
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isSubmitting ? 'Submitting...' : 'Next'}
                </Button>
            </div>
        </div>
    );
};

export default ProfileContent;
