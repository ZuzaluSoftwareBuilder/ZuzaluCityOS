import { useState } from 'react';
import RuleItem from './ruleItem';
import { Button } from '@/components/base';
import { Plus } from '@phosphor-icons/react';
import { useSpacePermissions } from '../../../components/permission';

function RuleList() {
  const { checkPermission } = useSpacePermissions();
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
    <div className="flex flex-col gap-5">
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
        size="lg"
        color="functional"
        className="p-[12px]"
        fullWidth
        endContent={<Plus size={18} />}
      >
        Create a Rule
      </Button>
    </div>
  );
}

export default RuleList;
