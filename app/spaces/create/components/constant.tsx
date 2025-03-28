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

// export const Categories = [
//     { id: 1, name: 'General Group', icon: <UsersThreeIcon />, color: "#FFB672" },
//     { id: 2, name: 'Event Org', icon: <NewspaperClippingIcon />, color: "#FFFA64" },
//     { id: 3, name: 'Venue', icon: <BuildingOfficeIcon />, color: "#B1FF68" },
//     { id: 4, name: 'Shop', icon: <StorefrontIcon />, color: "#77FAFF" },
//     { id: 5, name: 'Developer', icon: <CodeIcon />, color: "#7388FF" },
//     { id: 6, name: 'PermaHub', icon: <AirTrafficControlIcon />, color: "#D364FF" },
// ];
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
            color = "FFFA64"
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
