import RuleItem from './ruleItem';
import { Button } from '@/components/base';
import { Plus } from '@phosphor-icons/react';
import { useSpacePermissions } from '../../../components/permission';
import { useSpaceData } from '../../../components/context/spaceData';
import { PermissionName, SpaceGating } from '@/types';
import { useCallback, useState } from 'react';

function RuleList() {
  const { checkPermission } = useSpacePermissions();
  const { spaceData } = useSpaceData();
  const [isCreateRule, setIsCreateRule] = useState(false);

  const finishCreateRule = useCallback(() => {
    setIsCreateRule(false);
  }, []);

  const hasPermission = checkPermission(PermissionName.MANAGE_ACCESS);
  const accessRules =
    spaceData?.spaceGating?.edges.map((edge) => edge.node) || [];

  return (
    <div className="flex flex-col gap-5">
      {[
        ...accessRules,
        ...(isCreateRule
          ? [
              {
                id: 'new',
              } as unknown as SpaceGating,
            ]
          : []),
      ].map((rule) => (
        <RuleItem key={rule.id} data={rule} handleAddRule={finishCreateRule} />
      ))}

      {hasPermission && (
        <Button
          size="lg"
          color="functional"
          className="p-[12px]"
          fullWidth
          endContent={<Plus size={18} />}
          isDisabled={!hasPermission || isCreateRule}
          onPress={() => setIsCreateRule(true)}
        >
          Create a Rule
        </Button>
      )}
    </div>
  );
}

export default RuleList;
