import RuleItem from './ruleItem';
import { Button } from '@/components/base';
import { Plus } from '@phosphor-icons/react';
import { useSpacePermissions } from '../../../components/permission';
import { useSpaceData } from '../../../components/context/spaceData';

function RuleList() {
  const { checkPermission } = useSpacePermissions();
  const { spaceData } = useSpaceData();

  const accessRules =
    spaceData?.spaceGating.edges.map((edge) => edge.node) || [];

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
          key={rule.id}
          data={rule}
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
