import { useContext } from "react";
import { ProfileContext, ProfileContextProps } from "./ProfileContext";


export function useProfileContext(): ProfileContextProps {
    const context = useContext(ProfileContext);

    if (!context) return {};
    const { authorized, profile, setProfile } = context;

    return { authorized, profile, setProfile };
}
