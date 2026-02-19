import GlowButton from "../components/elements/static/GlowButton";
import StaticCard from "../components/elements/static/StaticCard";
import TagBadge from "../components/elements/static/TagBadge";
import InputField from "../components/elements/static/InputField";
import Divider from "../components/elements/static/Divider";
import SkeletonBlock from "../components/elements/static/SkeletonBlock";

import ToastNotify from "../components/elements/notify/ToastNotify";
import PulseIndicator from "../components/elements/notify/PulseIndicator";
import ProgressBarEl from "../components/elements/notify/ProgressBarEl";
import SpinnerEl from "../components/elements/notify/SpinnerEl";

import HoverButton from "../components/elements/interactive/HoverButton";
import RippleButton from "../components/elements/interactive/RippleButton";
import ToggleSwitch from "../components/elements/interactive/ToggleSwitch";
import TooltipEl from "../components/elements/interactive/TooltipEl";
import DropdownMenu from "../components/elements/interactive/DropdownMenu";

import EasingCurve from "../components/elements/alive/EasingCurve";
import ColorRelation from "../components/elements/alive/ColorRelation";
import SpacingBreath from "../components/elements/alive/SpacingBreath";
import ShadowDepth from "../components/elements/alive/ShadowDepth";
import StaggerFlow from "../components/elements/alive/StaggerFlow";

export const registry = {
  static: [
    { id: "glow-button", component: GlowButton, key: "gb" },
    { id: "static-card", component: StaticCard, key: "sc" },
    { id: "tag-badge", component: TagBadge, key: "tb" },
    { id: "input-field", component: InputField, key: "if" },
    { id: "divider", component: Divider, key: "dv" },
    { id: "skeleton", component: SkeletonBlock, key: "sk" },
  ],
  notify: [
    { id: "toast", component: ToastNotify, key: "tn" },
    { id: "pulse", component: PulseIndicator, key: "pi" },
    { id: "progress", component: ProgressBarEl, key: "pb" },
    { id: "spinner", component: SpinnerEl, key: "sp" },
  ],
  interactive: [
    { id: "hover", component: HoverButton, key: "hb" },
    { id: "ripple", component: RippleButton, key: "rb" },
    { id: "toggle", component: ToggleSwitch, key: "ts" },
    { id: "tooltip", component: TooltipEl, key: "tt" },
    { id: "dropdown", component: DropdownMenu, key: "dd" },
  ],
  alive: [
    { id: "easing", component: EasingCurve, key: "ec" },
    { id: "color", component: ColorRelation, key: "cr" },
    { id: "spacing", component: SpacingBreath, key: "sb" },
    { id: "shadow-depth", component: ShadowDepth, key: "sd" },
    { id: "stagger", component: StaggerFlow, key: "sf" },
  ],
};
