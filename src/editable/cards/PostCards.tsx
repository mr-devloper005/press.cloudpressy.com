import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Cover story' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 text-white shadow-[0_30px_70px_rgba(9,10,36,0.24)]">
      <div className="relative aspect-[16/10] min-h-[380px] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,23,70,0.02),rgba(18,22,62,0.9))]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span className="inline-flex rounded-full bg-[#ff9d23] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1f2551]">{label}</span>
          <h3 className="playful-serif mt-5 max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.05em] sm:text-6xl">{post.title}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">{getEditableExcerpt(post, 190)}</p>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.8rem] border border-[#e7dece] bg-white shadow-[0_18px_40px_rgba(17,22,68,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(17,22,68,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ece8df]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[#23245f] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ea5252]">{getEditableCategory(post)}</p>
        <h3 className="playful-serif mt-3 line-clamp-3 text-2xl font-black leading-[1.02] tracking-[-0.04em] text-[#1f2551]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#1f2551]/68">{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-start gap-2 rounded-[1.4rem] border border-transparent px-2 py-4 transition hover:border-[#e7dece] hover:bg-white/75">
      <span className="pt-1 text-3xl font-black leading-none text-[#ff9d23]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#1f2551]/45">
          <Clock3 className="h-3 w-3" /> {getEditableCategory(post)}
        </p>
        <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-0.03em] text-[#1f2551] group-hover:text-[#3d63ff]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-6 rounded-[2rem] border border-[#e7dece] bg-white p-4 shadow-[0_16px_34px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(17,22,68,0.12)] sm:grid-cols-[250px_minmax(0,1fr)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[#ece8df]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 self-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ea5252]">{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="playful-serif mt-3 line-clamp-3 text-3xl font-black leading-[1.02] tracking-[-0.05em] text-[#1f2551]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#1f2551]/70">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#3d63ff]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}
