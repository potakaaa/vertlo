/* Public props of the Vertlo components (from the design system index.d.ts, plus site-only link props). */
import type * as React from 'react';
export interface LinkItem { label: string; href: string }
type Node = React.ReactNode;
export type IconName = 'arrow-ne'|'plus'|'minus'|'check'|'search'|'bell'|'route'|'shield'|'layers'|'dashboard'|'doc'|'code'|'globe'|'bag'|'switch'|'card'|'store'|'refresh'|'pause'|'plug'|'chart';
export interface ButtonProps { variant?: 'primary'|'ghost'|'ghost-stealth'|'text'; size?: 'md'|'sm'|'lg'; full?: boolean; arrow?: boolean; href?: string; type?: 'button'|'submit'; onClick?: (e: React.MouseEvent) => void; className?: string; children?: Node }
export interface PillProps { tone?: 'stealth'|'new'|'green'|'neutral'|'live'|'paused'; className?: string; children?: Node }
export interface PillInputProps { value?: string; unit?: string; editable?: boolean; placeholder?: string; icon?: IconName }
export interface IconProps { name: IconName; size?: number; strokeWidth?: number; title?: string; className?: string }
export interface DiamondProps { size?: number; glow?: boolean; outline?: boolean; color?: string; className?: string }
export interface LogoProps { href?: string }
export interface StealthPanelProps { as?: string; haze?: boolean; className?: string; style?: React.CSSProperties; children?: Node }
export interface RingArtProps { icon?: IconName; className?: string }
export interface OrbitArtProps { core?: boolean; className?: string }
export interface ModuleArtProps { kind: 'routing'|'failover'|'alerts'|'underwriting'|'portal' }
export interface DiamondStackProps { className?: string }
export interface RoutingDiagramProps { label?: string }
export interface CountUpProps { to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }
export interface RotatingWordProps { words: string[]; interval?: number }
export interface NavProps { tone?: 'light'|'stealth'; scrolled?: boolean; links?: (string | LinkItem)[]; loginHref?: string; ctaHref?: string; loginLabel?: string; ctaLabel?: string }
export interface ModuleCardProps { title: string; tag?: string; tagTone?: PillProps['tone']; description?: string; art?: ModuleArtProps['kind']; slice?: CrmSliceKind; href?: string; minHeight?: number }
export interface MegaMenuProps { items: ModuleCardProps[]; columns?: number }
export interface HeroProps { variant?: 'white'|'stealth'; eyebrow?: string; title: Node; subhead?: string; primary?: string; secondary?: string; visual?: boolean; children?: Node }
export interface LineArtCardProps { title: string; lines?: number; body?: string; tag?: string; icon?: IconName; slice?: CrmSliceKind; figure?: FigureKind; inputs?: PillInputProps[] }
export interface PlanCardProps { featured?: boolean; figure?: FigureKind; tag: string; title: string; value: string; label?: string; cta?: string; footnote?: string; description?: string; icon?: IconName }
export interface StatCardProps { name: Node; value: number; decimals?: number; prefix?: string; unit?: string; label: string; tag?: string; illustrative?: boolean }
export interface FeaturePanelProps { ctaHref?: string; tag?: string; /* site: rich headings */ title: Node; description?: string; items: (string | { icon?: IconName; label: string; meta?: string })[]; slice?: CrmSliceKind; /** site: false hides the floating chip */ chip?: string | false; cta?: string; art?: Node }
export interface ProviderFlowProps { providers?: string[]; accounts?: string[]; layout?: 'horizontal'|'vertical' }
export interface NotificationProps { from?: string; time?: string; message: string; status?: { tone?: 'ok'|'paused'; label: string }; animate?: boolean; delay?: number }
export interface NotificationStackProps { items: NotificationProps[] }
export interface HowItWorksProps { steps: { kicker?: string; title: string; body: string; art?: PixelArtProps['kind']; slice?: CrmSliceKind; figure?: FigureKind; visual?: Node }[]; tone?: 'dark'|'light' }
export interface LogoStripProps { heading?: string; logos: (string | { src: string; alt: string })[] }
export interface TestimonialProps { quote: string; name: string; business: string; metric?: string }
export interface FAQProps { /* site: rich headings */ title?: Node; blurb?: string; cta?: string; ctaHref?: string; items: { q: string; a: string }[]; defaultOpen?: number }
export interface CTABandProps { /* site: rich headings */ title: Node; cta?: string; ctaHref?: string; points?: string[]; core?: boolean }
export interface FooterProps { tagline: string; columns: { title: string; links: (string | LinkItem)[] }[]; legal?: string[]; year?: number; wordmark?: boolean }
export interface PortalProps { merchant?: string; clipH?: number; fit?: boolean }
export interface PortalStageProps { clipH?: number; clipHMobile?: number; alerts?: boolean; label?: boolean; merchant?: string; className?: string }
export type CrmSliceKind = 'mids'|'routing'|'dispute'|'underwriting'|'providers'|'kpis'|'health'|'attention'|'volume'|'subscriptions'|'stores';
export interface CrmSliceProps { kind: CrmSliceKind; className?: string; style?: React.CSSProperties; decorative?: boolean }
export interface ProductCardProps { icon?: IconName; title: string; body?: string; slice?: CrmSliceKind; figure?: FigureKind; tag?: string; size?: 'md'|'sm'; featured?: boolean; className?: string }
export type FigureKind = 'routing'|'failover'|'disputes'|'stores'|'supplements'|'subscriptions'|'digital'|'setup'|'percent'|'quote'|'call';
export interface FigureProps { kind: FigureKind; className?: string; style?: React.CSSProperties }
export interface FeatureGridProps { items: { title: string; body: string; art: 'routing'|'failover'|'disputes'|'stores' }[]; illustrative?: boolean; className?: string }
export interface IndustryCardsProps { items: { title: string; body: string; art: 'supplements'|'subscriptions'|'digital'|'closed'|'scattered'|'underwriting' }[]; tone?: 'light'|'dark'; className?: string }
export interface FeatureStripProps { items: { icon: 'accounts'|'failover'|'alerts'|'underwriting'|'supplements'|'subscriptions'|'digital'; title: string; body: string }[]; variant?: 'loud'|'quiet'; tone?: 'dark'|'light'; className?: string }
export interface PixelArtProps { kind: 'connect'|'route'|'keep'; tone?: 'dark'|'light' }
