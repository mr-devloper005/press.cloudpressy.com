import Link from 'next/link'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
  return raw.length > 180 ? `${raw.slice(0, 180).trim()}...` : raw
}
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Coverage cards prioritize category, headline, and distribution-ready summaries.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Editorial cards balance long headlines, summaries, and clear entry points.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight identity, location, contact cues, and practical browsing.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer boards stay direct with pricing, condition, and quick action paths.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery browsing leads with visuals and compact supporting captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources stay text-led so they scan quickly and feel curated.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and library cues.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profiles emphasize identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
        voice={voice}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fffaf1] text-[#1f2551]">
        <section className="bg-[#23245f] text-white">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
            <div className="rounded-[2.4rem] border border-white/10 bg-white/6 p-7 shadow-[0_26px_70px_rgba(9,10,36,0.18)] sm:p-9">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#ffd65a]"><Icon className="h-4 w-4" /> {label}</div>
              <h1 className="playful-serif mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.06em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/76">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-6 rounded-[1.6rem] bg-white/8 p-4 text-sm leading-7 text-white/78">{deck.promise}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="rounded-xl bg-[#3d63ff] px-5 py-3 text-sm font-black text-white">Browse all</Link>
                <Link href="/search" className="rounded-xl border border-white/16 px-5 py-3 text-sm font-black text-white">Search posts</Link>
              </div>
            </div>

            <form action={basePath} className="self-end rounded-[2rem] bg-white p-5 text-[#1f2551] shadow-[0_24px_54px_rgba(17,22,68,0.16)]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#1f2551]/55"><Filter className="h-4 w-4" /> Filter</div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-[1rem] border border-[#d5dded] bg-white px-4 text-sm font-bold outline-none">
                <option value="all">All categories</option>
                {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full rounded-[1rem] bg-[#1f2551] text-sm font-black text-white">Apply</button>
              <p className="mt-3 text-xs font-bold text-[#1f2551]/55">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#d5dded] bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[#1f2551]/45" />
              <h2 className="playful-serif mt-4 text-3xl font-black tracking-[-0.04em]">No posts found</h2>
              <p className="mt-2 text-sm text-[#1f2551]/60">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-xl border border-[#d5dded] bg-white px-5 py-3 text-sm font-black text-[#1f2551]">Previous</Link> : null}
            <span className="rounded-xl bg-[#23245f] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-xl border border-[#d5dded] bg-white px-5 py-3 text-sm font-black text-[#1f2551]">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
  voice,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
  voice: typeof taskPageVoices[TaskKey]
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const secondary = posts.slice(1, 3)
  const remaining = posts.slice(3)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fffaf1] text-[#1f2551]">
        <section className="overflow-hidden bg-[#23245f] text-white">
          <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd65a]">{voice.eyebrow}</p>
                <h1 className="playful-serif mt-4 text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
                  {category === 'all' ? label : categoryLabel}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{voice.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {categories.slice(0, 6).map((item) => (
                    <Link
                      key={item.slug}
                      href={pageHref(basePath, item.slug, 1)}
                      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${category === item.slug ? 'border-[#ffd65a] bg-[#ffd65a] text-[#1f2551]' : 'border-white/18 bg-white/6 text-white'}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {lead ? (
                <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                  <Link href={`${basePath}/${lead.slug}`} className="group relative min-h-[29rem] overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/5">
                    <img src={getImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,22,61,0.04),rgba(20,22,61,0.88))]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <span className="rounded-full bg-[#ff9d23] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1f2551]">{getCategory(lead, label)}</span>
                      <h2 className="playful-serif mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">{lead.title}</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">{getSummary(lead)}</p>
                    </div>
                  </Link>

                  <div className="grid gap-4">
                    {secondary.map((post, index) => (
                      <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/6">
                        <div className="relative aspect-[16/11] overflow-hidden">
                          <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161946] via-transparent to-transparent" />
                        </div>
                        <div className="p-5">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd65a]">0{index + 1} / {getCategory(post, label)}</p>
                          <h3 className="mt-3 text-lg font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e5ddcf] bg-white">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
            <div className="flex flex-wrap gap-3">
              <Link href={basePath} className={category === 'all' ? 'rounded-full bg-[#1f2551] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white' : 'rounded-full border border-[#d5dded] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#1f2551]'}>
                Latest
              </Link>
              {categories.slice(0, 8).map((item) => (
                <Link
                  key={item.slug}
                  href={pageHref(basePath, item.slug, 1)}
                  className={category === item.slug ? 'rounded-full bg-[#ffd65a] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#1f2551]' : 'rounded-full border border-[#d5dded] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#1f2551]'}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <form action={basePath} className="flex overflow-hidden rounded-[1rem] border border-[#d5dded] bg-white">
              <select name="category" defaultValue={category} className="h-11 min-w-44 bg-transparent px-3 text-xs font-black uppercase outline-none">
                <option value="all">All categories</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="h-11 bg-[#23245f] px-5 text-xs font-black uppercase tracking-[0.14em] text-white">Filter</button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          {remaining.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post, index) => <EditorialArchiveCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} label={label} />)}
            </div>
          ) : !lead ? (
            <div className="rounded-[2rem] border border-dashed border-[#d5dded] bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[#1f2551]/45" />
              <h2 className="playful-serif mt-4 text-3xl font-black">No stories found</h2>
              <p className="mt-2 text-sm text-[#1f2551]/60">Try another category or publish a new newsroom story.</p>
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-xl border border-[#d5dded] bg-white px-5 py-3 text-sm font-black text-[#1f2551]">Previous</Link> : null}
            <span className="rounded-xl bg-[#23245f] px-5 py-3 text-sm font-black text-white">Page {page} / {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-xl border border-[#d5dded] bg-white px-5 py-3 text-sm font-black text-[#1f2551]">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchiveCard({ post, href, index, label }: { post: SitePost; href: string; index: number; label: string }) {
  const variant = index % 5
  const image = getImage(post)
  const category = getCategory(post, label)
  const summary = getSummary(post)

  if (variant === 0) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d5dded] bg-white shadow-[0_20px_50px_rgba(17,22,68,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(17,22,68,0.14)] md:col-span-2">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[18rem] overflow-hidden">
            <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ea5252]">Featured lane / {category}</p>
            <h3 className="playful-serif mt-3 text-3xl font-black leading-[0.98] tracking-[-0.05em] text-[#1f2551] sm:text-4xl">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#1f2551]/70">{summary}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#3d63ff]">Read story <ArrowRight className="h-4 w-4" /></span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 1) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d5dded] bg-white shadow-[0_16px_42px_rgba(17,22,68,0.08)] transition duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#ece8df]">
          <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#131742] to-transparent p-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ffd65a]">{category}</p>
            <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em]">{post.title}</h3>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 2) {
    return (
      <Link href={href} className="group rounded-[2rem] border border-[#d5dded] bg-[#23245f] p-6 text-white shadow-[0_16px_42px_rgba(17,22,68,0.12)] transition duration-300 hover:-translate-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd65a]">{category}</p>
        <h3 className="playful-serif mt-4 text-3xl font-black leading-[1] tracking-[-0.04em]">{post.title}</h3>
        <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/78">{summary}</p>
      </Link>
    )
  }

  if (variant === 3) {
    return (
      <Link href={href} className="group rounded-[2rem] border border-[#d5dded] bg-white p-5 shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
        <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
          <div className="relative aspect-[1/1] overflow-hidden rounded-[1.4rem] bg-[#ece8df]">
            <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ea5252]">{category}</p>
            <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[#1f2551]">{post.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#1f2551]/68">{summary}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d5dded] bg-white shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#ece8df]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ea5252]">{category}</p>
        <h3 className="playful-serif mt-3 line-clamp-3 text-2xl font-black leading-[1.02] tracking-[-0.04em] text-[#1f2551]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#1f2551]/68">{summary}</p>
      </div>
    </Link>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}`
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d5dded] bg-white shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ece8df]">
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#1f2551]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ea5252]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em] text-[#1f2551]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#1f2551]/65">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[#d5dded] bg-white p-5 shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1 sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f5f7ff] ring-1 ring-[#d5dded]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 text-[#1f2551]/45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#1f2551] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[#d5dded] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#1f2551]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em] text-[#1f2551]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#1f2551]/65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[#1f2551]/70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d5dded] bg-white shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#23245f] p-5 text-white">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={post.title} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-90" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em] text-[#1f2551]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#1f2551]/65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#3d63ff]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[#d5dded] bg-white shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f7ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#1f2551]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em] text-[#1f2551]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[#d5dded] bg-white p-6 shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1 hover:bg-[#23245f] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#d5dded] bg-white p-6 shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[#23245f] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[#f5f7ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#1f2551]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em] text-[#1f2551]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#1f2551]/65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#3d63ff]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#d5dded] bg-white p-6 text-center shadow-[0_16px_42px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#f5f7ff] ring-1 ring-[#d5dded]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[#1f2551]/45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em] text-[#1f2551]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#ea5252]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#1f2551]/65">{getSummary(post)}</p>
    </Link>
  )
}
