import { PropsWithChildren } from 'react';

export interface ISubTabItemProps {
}

const SubTabItemContainer: React.FC<PropsWithChildren<ISubTabItemProps>> = ({ children }) => {
    return (
        <div className="flex h-[30px] pl-2.5">
            <div className="w-5 flex justify-center items-center">
                <div className="w-0 h-[30px] border-r border-[rgba(255,255,255,0.2)]"></div>
            </div>
            {children}
        </div>
    );
};

export default SubTabItemContainer;