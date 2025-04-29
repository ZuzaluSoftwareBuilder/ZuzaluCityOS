import { Button } from '@/components/base';
import { SpaceGating } from '@/models/spaceGating';
import { PermissionName } from '@/types';
import { Plus } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';
import { useSpaceData } from '../../../components/context/spaceData';
import { useSpacePermissions } from '../../../components/permission';
import RuleItem from './ruleItem';

function RuleList() {
  const { checkPermission } = useSpacePermissions();
  const { spaceData } = useSpaceData();
  const [isCreateRule, setIsCreateRule] = useState(false);

  const finishCreateRule = useCallback(() => {
    setIsCreateRule(false);
  }, []);

  const hasPermission = checkPermission(PermissionName.MANAGE_ACCESS);
  const accessRules = spaceData?.spaceGating || [];

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
