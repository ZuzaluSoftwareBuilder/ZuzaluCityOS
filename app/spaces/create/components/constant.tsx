import BuildingOfficeIcon from "@/components/icons/BuildingOffice";
import NewspaperClippingIcon from "@/components/icons/NewspaperClipping";
import { UsersThreeIcon } from "@/components/icons/UsersThree";
import { StorefrontIcon } from "@/components/icons/Storefront";
import { CodeIcon } from "@/components/icons/Code";
import { AirTrafficControlIcon } from "@/components/icons/AirTrafficControl";
import { Categories as SpaceTypesConstant } from "@/constant";

type SpaceType = {
    value: string;
    label: string;
    icon: JSX.Element;
    color: string;
};

export const Categories = SpaceTypesConstant.map((i) => {
    let icon = null
    let color = null
    const value = i.value
    const label = i.label
    switch(i.value) {
        case 'general-group': {
            icon = <UsersThreeIcon />
            color = "#FFB672"
            break;
        }
        case 'event-org': {
            icon = <NewspaperClippingIcon />
            color = "#FFFA64"
            break;
        }
        case 'venue': {
            icon = <BuildingOfficeIcon />
            color = "#B1FF68"
            break;
        }
        case 'shop': {  
            icon = <StorefrontIcon />
            color = "#77FAFF"
            break;
        }
        case 'developer': {
            icon = <CodeIcon />
            color = "#7388FF"
            break;
        }
        case 'permahub': {
            icon = <AirTrafficControlIcon />
            color = "#D364FF"
            break;
        }
        default: {
            icon = <UsersThreeIcon />
            color = "#FFB672"
        }
    }
    return {
        value,
        label,
        icon,
        color
    } 
})
