import { PropsWithChildren } from 'react';

export interface ISubTabItemProps {}

const SubTabItemContainer: React.FC<PropsWithChildren<ISubTabItemProps>> = ({
  children,
}) => {
  return (
    <div className="flex h-[30px] pl-2.5">
      <div className="flex w-5 items-center justify-center">
        <div className="h-[30px] w-0 border-r border-[rgba(255,255,255,0.2)]"></div>
      </div>
      {children}
    </div>
  );
};

export default SubTabItemContainer;
