import {
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Youtube,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Send,
  MessageSquare,
  Pen,
  Palette,
  Link as LinkIcon,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
  website: Globe,
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  telegram: Send,
  discord: MessageSquare,
  medium: Pen,
  dribbble: Palette,
  behance: Palette,
  custom: LinkIcon,
}

export default function PlatformIcon({
  platform,
  className = 'w-5 h-5',
}: {
  platform: string
  className?: string
}) {
  const Icon = iconMap[platform] || LinkIcon
  return <Icon className={className} />
}
