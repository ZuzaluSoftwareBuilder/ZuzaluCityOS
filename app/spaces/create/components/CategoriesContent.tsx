import React from 'react';
import { Card, CardBody, Input, Button, Chip } from '@/components/base';
import { 
  UsersThreeIcon, 
  NewspaperClippingIcon, 
  BuildingOfficeIcon,
  StorefrontIcon,
  CodeIcon,
  AirTrafficControlIcon,
  CaretLeftIcon,
  CareRightIcon
} from '@/components/icons';
import SelectCategories from '@/components/select/selectCategories';
import { CloseIcon } from '@/components/icons/Close';
interface CategorCardProps {
  icon?: React.ReactNode;
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

const CategorCard: React.FC<CategorCardProps> = ({ icon, title, selected = false, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        selected 
          ? 'bg-white/[0.1] border border-white' 
          : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05]'
      } rounded-[10px]`}
      onClick={onClick}
    >
      <CardBody className="flex flex-row gap-[14px] items-center px-5">
        {icon && (
          <div className="w-6 h-6">
            {icon}
          </div>
        )}
        <div className="text-base font-semibold leading-[1.4]">{title}</div>
      </CardBody>
    </Card>
  );
};

const CategoriesContent = () => {
  // 分类数据
  const categories = [
    { id: 1, name: 'General Group', icon: <UsersThreeIcon size={7} color="#FFB672" />, selected: true },
    { id: 2, name: 'Event Org', icon: <NewspaperClippingIcon size={7} color="#FFFA64" />, selected: false },
    { id: 3, name: 'Venue', icon: <BuildingOfficeIcon size={7} color="#B1FF68" />, selected: false },
    { id: 4, name: 'Shop', icon: <StorefrontIcon size={7} color="#77FAFF" />, selected: false },
    { id: 5, name: 'Developer', icon: <CodeIcon size={7} color="#7388FF" />, selected: false },
    { id: 6, name: 'PermaHub', icon: <AirTrafficControlIcon size={7} color="#D364FF" />, selected: false },
  ];

  // 已选标签
  const selectedTags = ['Social', 'Social', 'Social'];


  return (
    <div className="space-y-8">
      {/* 标题部分 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Community Labels</h2>
        <p className="text-white/80 text-base">
          Some informational labels to indicate to users of this community's core focuses and activities
        </p>
      </div>

      {/* 分类选择部分 */}
      <Card className="bg-white/[0.02] border border-white/10 rounded-[10px]">
        <CardBody className="p-5 space-y-8">
          {/* 选择分类部分 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Select Categories*</h3>
              <p className="text-white/80 text-sm">
                Select the ones that relay your space's focuses
              </p>
            </div>

            {/* 分类选项网格 */}
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <CategorCard 
                  key={category.id}
                  icon={category.icon}
                  title={category.name}
                  selected={category.selected}
                />
              ))}
            </div>

            <p className="text-white/50 text-sm">
              Note: Space types will include more functionalities in future versions.
            </p>
          </div>

          {/* 社区标签部分 */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Community Tags (Max: 5)</h3>
              <p className="text-white/60 text-xs">
                Create or search for existing categories related to this community
              </p>
            </div>

            <div className="space-y-4">
              {/* 搜索输入框 */}
              <SelectCategories onChange={() => {}} />

              {/* 已选标签 */}
              <div className="flex flex-wrap gap-2.5">
                {selectedTags.map((tag, index) => (
                  <Chip 
                    key={index}
                    // className="bg-white/20 border border-white/40 rounded-md px-2 py-1"
                    endContent={<CloseIcon size={4}  />}
                  >
                    <span>{tag}</span>
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
              {/* 底部按钮 */}
              <div className="flex justify-end gap-2.5">
            <Button
                color="secondary"
                size="md"
                className="w-[120px]"
                startContent={<CaretLeftIcon />}
            >
                Back
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
};

export default CategoriesContent;
