import { useState } from 'react';
import RuleItem from './ruleItem';
import { Button } from '@/components/base';
import { Plus } from '@phosphor-icons/react';

function RuleList() {
  const [accessRules, setAccessRules] = useState<
    {
      title: string;
      tags: string[];
      isActive: boolean;
    }[]
  >([
    {
      title: 'Become Member',
      tags: ['DevCon 5'],
      isActive: true,
    },
    {
      title: 'Become Member',
      tags: ['DevCon 5'],
      isActive: false,
    },
  ]);

  const handleEditRule = (index: number) => {
    // 编辑规则的逻辑
    console.log('编辑规则:', index);
  };

  const handleAddRule = () => {
    // 添加新规则的逻辑
    console.log('添加新规则');
  };

  return (
    <div>
      {accessRules.map((rule, index) => (
        <RuleItem
          key={index}
          title={rule.title}
          tags={rule.tags}
          isActive={rule.isActive}
          onEdit={() => handleEditRule(index)}
        />
      ))}

      <Button
        className="flex w-full flex-row items-center justify-center gap-2.5 rounded-lg bg-white/5 p-3"
        onPress={handleAddRule}
      >
        <Plus size={24} />
        <span className="text-base font-medium text-white">Create a Rule</span>
      </Button>
    </div>
  );
}

export default RuleList;
