import React, { useState } from 'react';
import { Card } from '@/components/base/card';
import { Input, Button, Select, SelectItem } from '@/components/base';
import { XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

const LinksContent = () => {
    const [socialLinks, setSocialLinks] = useState<number[]>([0]);
    const [customLinks, setCustomLinks] = useState<number[]>([0]);

    const handleAddSocialLink = () => {
        if (socialLinks.length === 0) {
            setSocialLinks([0]);
            return;
        }
        const nextItem = Math.max(...socialLinks) + 1;
        setSocialLinks([...socialLinks, nextItem]);
    };

    const handleRemoveSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter(item => item !== index));
    };

    const handleAddCustomLink = () => {
        if (customLinks.length === 0) {
            setCustomLinks([0]);
            return;
        }
        const nextItem = Math.max(...customLinks) + 1;
        setCustomLinks([...customLinks, nextItem]);
    };

    const handleRemoveCustomLink = (index: number) => {
        setCustomLinks(customLinks.filter(item => item !== index));
    };

    const socialOptions = [
        { label: "Twitter/X", value: "twitter" },
        { label: "Instagram", value: "instagram" },
        { label: "Discord", value: "discord" },
        { label: "Telegram", value: "telegram" }
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl text-white font-bold">Community Links</h2>
                <p className="text-white/80 text-base">
                    Include your social and other custom links
                </p>
            </div>
            <Card className="p-5">
                <div className="pb-4 border-b border-white/10 mb-8">
                    <h3 className="text-sm text-white/50 font-bold mb-5">Social Links</h3>
                    {socialLinks.map((item) => (
                        <div key={item} className="flex gap-2.5">
                            <div className="flex-1 space-y-4">
                                <label className="block text-base text-white font-medium">Select Social</label>
                                <Select
                                    className="w-full"
                                    placeholder="select"
                                    variant="flat"
                                >
                                    {socialOptions.map((option) => (
                                        <SelectItem key={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex-1 space-y-4">
                                <label className="block text-base text-white font-medium opacity-0">URL</label>
                                <div className="flex gap-[10px] items-center">
                                    <Input
                                        type="url"
                                        placeholder="https://"
                                        className="w-full"
                                    />
                                    <button onClick={() => handleRemoveSocialLink(item)}>
                                        <XCircleIcon className="h-6 w-6 opacity-50" />
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddSocialLink}
                        className="mt-2 w-full bg-transparent opacity-80 py-2 px-[14px] font-semibold text-sm justify-start flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        <div>Add Social Link</div>
                    </button>
                </div>

                <div className="">
                    <h3 className="text-sm text-white/50 font-bold mb-5">Custom Links</h3>
                    {customLinks.map((item) => (
                        <div key={item} className="flex gap-2.5">
                            <div className="flex-1 space-y-1">
                                <label className="block text-base text-white font-medium  mb-5">Link Title</label>
                                <Input
                                    type="text"
                                    placeholder="type a name"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <label className="block text-base text-white font-medium  mb-5 opacity-0">URL</label>
                                <div className="flex gap-[10px] items-center">
                                    <Input
                                        type="url"
                                        placeholder="https://"
                                        className="w-full"
                                    />
                                    <button onClick={() => handleRemoveCustomLink(item)}>
                                        <XCircleIcon className="h-6 w-6 opacity-50" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddCustomLink}
                        className="mt-2 w-full bg-transparent opacity-80 py-2 px-3.5 font-semibold text-sm justify-start flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        <div>Add Custom Link</div>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LinksContent;
