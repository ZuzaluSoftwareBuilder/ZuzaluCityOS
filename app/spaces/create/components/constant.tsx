import BuildingOfficeIcon from "@/components/icons/BuildingOffice";
import NewspaperClippingIcon from "@/components/icons/NewspaperClipping";
import { UsersThreeIcon } from "@/components/icons/UsersThree";
import { StorefrontIcon } from "@/components/icons/Storefront";
import { CodeIcon } from "@/components/icons/Code";
import { AirTrafficControlIcon } from "@/components/icons/AirTrafficControl";

export const SpaceTypes = [
    { id: 1, name: 'General Group', icon: <UsersThreeIcon />, color: "#FFB672" },
    { id: 2, name: 'Event Org', icon: <NewspaperClippingIcon />, color: "#FFFA64" },
    { id: 3, name: 'Venue', icon: <BuildingOfficeIcon />, color: "#B1FF68" },
    { id: 4, name: 'Shop', icon: <StorefrontIcon />, color: "#77FAFF" },
    { id: 5, name: 'Developer', icon: <CodeIcon />, color: "#7388FF" },
    { id: 6, name: 'PermaHub', icon: <AirTrafficControlIcon />, color: "#D364FF" },
];
